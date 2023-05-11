let options = {};
let defaultOptions = getDefaultOptions();

function loadOptions() {
    browser.storage.local.get().then((result) => {
        options = result;
    });
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

    jsonData = {};

    Object.entries(propertyMapping).forEach(([propertyPath, value]) => {
        if (value.startsWith("historyItem.")) {
            value = historyItem[value.split(".")[1]];
        } else if (value === "now.timestamp") {
            value = new Date().getTime();
        }

        _.set(jsonData, propertyPath, value);
    });

    let headers = {
        "Content-Type": "application/json"
    };

    if (auth.username && auth.password) {
        headers["Authorization"] = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;
    }

    fetch(options.url, {
        mode: "no-cors",
        method: options.method || "POST",
        headers: headers,
        body: JSON.stringify(jsonData)
    });
});