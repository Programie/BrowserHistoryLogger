import axios from "axios";
import _ from "lodash";
import {loadConfig} from "./common";

let options = {};

function loadOptions() {
    loadConfig((result) => {
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
        username: options.username,
        password: options.password
    };

    let jsonData = {};

    Object.entries(options.propertyMapping).forEach(([propertyPath, value]) => {
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