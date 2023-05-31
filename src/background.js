import axios from "axios";
import _ from "lodash";
import {loadConfig} from "./common";

let options = {};
let queuedRequests = [];

function loadOptions() {
    loadConfig((result) => {
        options = result;
    });
}

function getReplacementValue(value, data) {
    if (value.startsWith("historyItem.") && data.hasOwnProperty("historyItem")) {
        value = data.historyItem[value.split(".")[1]];
    } else if (value.startsWith("tab.") && data.hasOwnProperty("tab")) {
        value = data.tab[value.split(".")[1]];
    } else if (value === "now.timestamp") {
        value = new Date().getTime();
    }

    return value;
}

function sendRequest(request) {
    let headers = {
        "Content-Type": "application/json"
    };

    if (options.username && options.password) {
        headers["Authorization"] = `Basic ${btoa(`${options.username}:${options.password}`)}`;
    }

    return axios(Object.assign({}, {
        method: options.method || "POST",
        headers: headers
    }, request)).then(() => {
        browser.browserAction.setBadgeBackgroundColor({"color": "green"});
        browser.browserAction.setBadgeText({text: queuedRequests.length.toString()});
        browser.browserAction.setTitle({title: "Last request was successful"});
    }).catch((error) => {
        browser.browserAction.setBadgeBackgroundColor({"color": "red"});
        browser.browserAction.setBadgeText({text: queuedRequests.length.toString()});
        browser.browserAction.setTitle({title: `Last request failed: ${error.message}`});

        if (options.retryOnError) {
            queuedRequests.push(request);
        }
    });
}

function resendQueuedRequests() {
    if (!options.retryOnError) {
        return;
    }

    let requests = queuedRequests.splice(0, 5);

    requests.forEach((request) => {
        sendRequest(request);
    });
}

function sendTabData(tab) {
    let usesHistoryItem = Object.values(options.propertyMapping).find(value => value.startsWith("historyItem.")) !== undefined;

    new Promise((resolve, reject) => {
        if (options.url.includes("%historyItem.") || usesHistoryItem) {
            browser.history.search({text: tab.url}).then((historyItems) => {
                resolve({
                    historyItem: historyItems.find(item => item.url === tab.url)
                });
            });
        } else {
            resolve({});
        }
    }).then((inputData) => {
        inputData = Object.assign({
            tab: tab
        }, inputData);

        let jsonData = {};

        Object.entries(options.propertyMapping).forEach(([propertyPath, value]) => {
            _.set(jsonData, propertyPath, getReplacementValue(value, inputData));
        });

        let url = options.url.replace(/%[^%]+%/g, (key) => {
            return encodeURIComponent(getReplacementValue(key.replace(/%/g, ""), inputData));
        });

        let request = {
            url: url,
            data: jsonData
        };

        sendRequest(request);
    });
}

loadOptions();
browser.storage.local.onChanged.addListener(loadOptions);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete") {
        return;
    }

    if (tab.url.startsWith("about:") || tab.url.startsWith("chrome://")) {
        return;
    }

    if (!options.url) {
        console.error("No target URL defined!");
        browser.browserAction.setBadgeBackgroundColor({"color": "red"});
        browser.browserAction.setBadgeText({text: "!!!"});
        browser.browserAction.setTitle({title: "No target URL defined!"});
        return;
    }

    sendTabData(tab);
});

window.setInterval(resendQueuedRequests, 10000);