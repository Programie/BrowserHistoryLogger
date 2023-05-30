import "bootstrap/dist/css/bootstrap.css";

import {loadConfig} from "./common";

function saveOptions(event) {
    let propertyMappingText = document.querySelector("#property-mapping").value;
    let properties = {};

    propertyMappingText.split("\n").forEach((line) => {
        line = line.trim();

        if (line === "") {
            return;
        }

        line = line.split(":");
        if (line.length !== 2) {
            return;
        }

        let key = line[0].trim();
        let value = line[1].trim();

        if (key === "") {
            return;
        }

        properties[key] = value;
    })

    browser.storage.local.set({
        url: document.querySelector("#url").value,
        method: document.querySelector("#method").value,
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value,
        retryOnError: document.querySelector("#retry-on-error").checked,
        propertyMapping: properties
    });

    event.preventDefault();
}

function loadOptions() {
    loadConfig((result) => {
        document.querySelector("#url").value = result.url;
        document.querySelector("#method").value = result.method;
        document.querySelector("#username").value = result.username;
        document.querySelector("#password").value = result.password;
        document.querySelector("#retry-on-error").checked = result.retryOnError;

        let propertyMappingText = [];

        Object.entries(result.propertyMapping).forEach(([key, value]) => {
            propertyMappingText.push(`${key}: ${value}`);
        });

        document.querySelector("#property-mapping").value = propertyMappingText.join("\n");
    });
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

document.querySelector("html").setAttribute("data-bs-theme", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");