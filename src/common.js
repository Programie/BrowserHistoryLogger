export function getDefaultOptions() {
    return {
        url: "",
        method: "POST",
        username: "",
        password: "",
        propertyMapping: {
            url: "tab.url"
        },
        retryOnError: false
    };
}

export function loadConfig(callback) {
    browser.storage.local.get().then((result) => {
        result = Object.assign({}, getDefaultOptions(), result);

        callback(result);
    });
}