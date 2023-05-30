import axios from "axios";
import _ from "lodash";
import {getDefaultOptions} from "./common";

let options = {};
let defaultOptions = getDefaultOptions();

function loadOptions() {
    browser.storage.local.get().then((result) => {
        options = result;
    });
}

function getReplacementValue(value, historyItem) {
    if (value.startsWith("historyItem.")) {
        value = historyItem[value.split(".")[1]];
    } else if (value === "now.timestamp") {
        value = new Date().getTime();
    }

    return value;
}

loadOptions();
browser.storage.local.onChanged.addListener(loadOptions);

browser.history.onVisited.addListener((historyItem) => {
    if (!options.url) {
        console.error("No target URL defined!");
        return;
    }

    let auth = {
        username: options.username || defaultOptions.username,
        password: options.password || defaultOptions.password
    };

    let propertyMapping = options.propertyMapping || defaultOptions.propertyMapping;

    let jsonData = {};

    Object.entries(propertyMapping).forEach(([propertyPath, value]) => {
        _.set(jsonData, propertyPath, getReplacementValue(value, historyItem));
    });

    let headers = {
        "Content-Type": "application/json"
    };

    if (auth.username && auth.password) {
        headers["Authorization"] = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;
    }

    let url = options.url.replace(/%[^%]+%/g, (key) => {
        return encodeURIComponent(getReplacementValue(key.replace(/%/g, ""), historyItem));
    });

    axios({
        url: url,
        method: options.method || "POST",
        headers: headers,
        data: jsonData
    });
});