let defaultOptions = getDefaultOptions();

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
        propertyMapping: properties
    });

    event.preventDefault();
}

function loadOptions() {
    browser.storage.local.get().then((result) => {
        document.querySelector("#url").value = result.url || defaultOptions.url;
        document.querySelector("#method").value = result.method || defaultOptions.method;

        propertyMappingText = [];

        Object.entries(result.propertyMapping || defaultOptions.propertyMapping).forEach(([key, value]) => {
            propertyMappingText.push(`${key}: ${value}`);
        });

        document.querySelector("#property-mapping").value = propertyMappingText.join("\n");
    });
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

document.querySelector("html").setAttribute("data-bs-theme", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");