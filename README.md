# Browser History Logger

A browser extension to log each opened website to a user specified HTTP endpoint.

## Build

Requirements:

* NodeJS
* npm

Install the required dependencies using `npm install`.

After that, you can build the extension using `npm run build`. Or you might use `npm run start` to build and start the extension.

## HTTP Endpoint

The configured HTTP endpoint must provide correct CORS headers.

If you are using PHP, you might do it using the following headers:

```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
```