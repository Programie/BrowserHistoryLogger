# Changelog

## [1.0.2] - 2023-05-31

* Listen for `browser.tabs.onUpdated` instead of `browser.history.onVisited` to fix triggering by sync activity

## [1.0.1] - 2023-05-30

* Added support for placeholders like %historyItem.url% in URL
* Implemented "Retry on error" to resend requests if an error (i.e. network error) occurred
* Open options as browser action (click on extension in extensions menu)
* Show last request state in badge of the extension icon

## [1.0.0] - 2023-05-12

Initial release