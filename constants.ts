// tslint:disable max-line-length
export default {
    ERROR_KEY_DOES_NOT_EXIST: 1, // Account authorization key not found in the system
    ERROR_NO_SLOT_AVAILABLE: 2, // No idle captcha workers are available at the moment, please try a bit later or try increasing your maximum bid here
    ERROR_ZERO_CAPTCHA_FILESIZE: 3, // The size of the captcha you are uploading is less than 100 bytes.
    ERROR_TOO_BIG_CAPTCHA_FILESIZE: 4, // The size of the captcha you are uploading is more than 500, 000 bytes.
    ERROR_ZERO_BALANCE: 10, // Account has zeo or negative balance
    ERROR_IP_NOT_ALLOWED: 11, // Request with current account key is not allowed from your IP.Please refer to IP list section located here
    ERROR_CAPTCHA_UNSOLVABLE: 12, // Captcha could not be solved by 5 different workers
    ERROR_BAD_DUPLICATES: 13, // 100 % recognition feature did not work due to lack of amount of guess attempts
    ERROR_NO_SUCH_METHOD: 14, // Request to API made with method which does not exist
    ERROR_IMAGE_TYPE_NOT_SUPPORTED: 15, // Could not determine captcha file type by its exif header or image type is not supported.The only allowed formats are JPG, GIF, PNG
    ERROR_NO_SUCH_CAPCHA_ID: 16, // Captcha you are requesting does not exist in your current captchas list or has been expired. Captchas are removed from API after 5 minutes after upload.
    ERROR_EMPTY_COMMENT: 20, // "comment" property is required for this request
    ERROR_IP_BLOCKED: 21, // Your IP is blocked due to API inproper use.Check the reason at https://anti-captcha.com/panel/tools/ipsearch
    ERROR_TASK_ABSENT: 22, // Task property is empty or not set in createTask method.Please refer to API v2 documentation.
    ERROR_TASK_NOT_SUPPORTED: 23, // Task type is not supported or inproperly printed.Please check \"type\" parameter in task object.
    ERROR_INCORRECT_SESSION_DATA: 24, // Some of the required values for successive user emulation are missing.
    ERROR_PROXY_CONNECT_REFUSED: 25, // Could not connect to proxy related to the task, connection refused
    ERROR_PROXY_CONNECT_TIMEOUT: 26, // Could not connect to proxy related to the task, connection timeout
    ERROR_PROXY_READ_TIMEOUT: 27, // Connection to proxy for task has timed out
    ERROR_PROXY_BANNED: 28, // Proxy IP is banned by target service
    ERROR_PROXY_TRANSPARENT: 29, // Task denied at proxy checking state.Proxy must be non- transparent to hide our server IP.
    ERROR_RECAPTCHA_TIMEOUT: 30, // Recaptcha task timeout, probably due to slow proxy server or Google server
    ERROR_RECAPTCHA_INVALID_SITEKEY: 31, // Recaptcha server reported that site key is invalid
    ERROR_RECAPTCHA_INVALID_DOMAIN: 32, // Recaptcha server reported that domain for this site key is invalid
    ERROR_RECAPTCHA_OLD_BROWSER: 33, // Recaptcha server reported that browser user- agent is not compatible with their javascript
    ERROR_RECAPTCHA_STOKEN_EXPIRED: 34, // Recaptcha server reported that stoken parameter has expired.Make your application grab it faster.
    ERROR_PROXY_HAS_NO_IMAGE_SUPPORT: 35, // Proxy does not support transfer of image data from Google servers
    ERROR_PROXY_INCOMPATIBLE_HTTP_VERSION: 36, // Proxy does not support long GET requests with length about 2000 bytes and does not support SSL connections
};
