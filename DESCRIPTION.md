

***NOTICE:***  *We have updated the sandbox base url to <https://public-api.sandbox.bunq.com/v1/>. Please update your applications accordingly. Check here: https://github.com/bunq/sdk_php/issues/149 for more info.*

***NOTICE***: *We're changing the origin of our callbacks for sandbox to originate from the Amazon network. Read the [receiving callbacks](#Receiving-Callbacks)  section for more info.*

# Introduction

Welcome to bunq!

- The bunq API is organised around REST. JSON will be returned in almost all responses from the API, including errors but excluding binary (image) files.
- All calls made through bunq Doc are executed on a sandbox environment. No real money is used and no transactions to external bank accounts can be done.
- Please configure your implementation to send its API requests to https://public-api.sandbox.bunq.com/v1/
- There is an version of the [Android app](https://appstore.bunq.com/api/android/builds/bunq-android-sandbox-master.apk) that connect to the bunq Sandbox environment.

## Get Started

1. Create a user account with your phone. Afterwards, you can use this account to create an API key from which you can make API calls. You can find API key management under 'Profile' -\> 'Security'.
2. Register a device. A device can be a phone (private), computer or a server (public). You can register a new device by using the installation and device-server calls.
3. Open a session. Sessions are temporary and expire after the same amount of time you have set for auto logout in your user account.
4. Make your first call!

## Versioning

Our API is currently in an initial testing phase. This means we will iterate quickly to improve it and related tooling. This also allows us to quickly process your feedback (which we are happy to receive!). Therefore, we have chosen not to attach any version numbers to the changes just yet. We will inform you in a timely manner of any important changes we make before they are deployed on together.bunq.com.

Once the speed of iteration slows down and more developers start using the API and its sandbox we will start versioning the API using the version number in the HTTP URLs (i.e. the '/v1' part of the path). We will inform you when this happens.

# OAuth

### What is OAuth?

[OAuth 2.0](https://www.oauth.com/oauth2-servers/getting-ready/) is a protocol that will let your app connect to your bunq users in a safe and easy way. 

### Get started with OAuth for bunq

Follow these steps to get started with OAuth:
1. Register your OAuth Client in the bunq app, you will find the option within "Security & Settings > Developers".
2. Add one or more Redirect URLs.
3. Get your Client ID and Client Secret from the bunq app.
4. Redirect your users to the OAuth authorization URL as described [here](###authorization-request).
5. If the user accepts your Connection request then he will be redirected to the previously specified `redirect_uri` with an authorization Code parameter.
6. Use the [token endpoint](###token-exchange) to exchange the authorization Code for an Access Token.
7. The Access Token can be used as a normal API Key, open a session with the bunq API or use our SDKs and get started!

### What can my apps do with OAuth?

We decided to launch OAuth with a default permission that allows you to perform the following actions:
- Read only access to the Monetary Accounts.
- Read access to Payments & Transactions.
- Create new Payments, but only between Monetary Accounts belonging to the same user.
- Create new Draft-Payments.
- Change the primary monetary to which a Card is linked to.
- Read only access to Request-Inquiries and Request-Responses.


### Authorization Request

Your web or mobile app should redirect users to the following URL:

`https://oauth.bunq.com/auth`

The following parameters should be passed:

- `response_code` - bunq supports the authorization code grant, provide `code` as parameter (required)
- `client_id` - your Client ID, get it from the bunq app (required)
- `redirect_uri` - the URL you wish the user to be redirected after the authorization, make sure you register the Redirect URL in the bunq app (required)
- `state` - a unique string to be passed back upon completion (optional)

**Authorization request example:**

```
https://oauth.bunq.com/auth?response_type=code
&client_id=1cc540b6e7a4fa3a862620d0751771500ed453b0bef89cd60e36b7db6260f813
&redirect_uri=https://www.bunq.com
&state=594f5548-6dfb-4b02-8620-08e03a9469e6
```

**Authorization request response:**

```
https://www.bunq.com/?code=7d272be434a75933f40c13d56aef6c31496005b653074f7d6ac57029d9995d30
&state=594f5548-6dfb-4b02-8620-08e03a9469e6

```


### Token Exchange

If everything went well then you can exchange the authorization Code that we returned you for an Access Token to use with the bunq API.

Make a POST call to the following endpoint:

`https://api.oauth.bunq.com/v1/token`

The following parameters should be passed:

- `grant_type` - the grant type used, `authorization_code` for now (required)
- `code` -  the authorization code received from bunq (required)
- `redirect_uri` - the same Redirect URL used in the authorisation request (required)
- `client_id` - your Client ID (required)
- `client_secret` - your Client Secret (required)

**Token request example:**

```
https://api.oauth.bunq.com/v1/token?grant_type=authorization_code&code=7d272be434a75933f40c13d56aef6c31496005b653074f7d6ac57029d9995d30
&redirect_uri=https://www.bunq.com/
&client_id=1cc540b6e7a4fa3a862620d0751771500ed453b0bef89cd60e36b7db6260f813
&client_secret=184f969765f6f74f53bf563ae3e9f891aec9179157601d25221d57f2f1151fd5
```

Note: the request only contains URL parameters.

**Example successful response:**

```
{
    "access_token": "8baec0ac1aafca3345d5b811042feecfe0272514c5d09a69b5fbc84cb1c06029",
    "token_type": "bearer",
    "state": "594f5548-6dfb-4b02-8620-08e03a9469e6"
}
```

**Example error response:**

```
{
    "error": "invalid_grant",
    "error_description": "The authorization code is invalid or expired."
}
```

### What's next?

Visit us on together.bunq.com, share your creations, ask question and build your very own bunq app!

# Authentication

- We use encryption for all API calls. This means that all requests must use HTTPS. The HTTP standard calls will fail. You should also use SSL Certificate Pinning and Hostname Verification to ensure a secure connection with bunq.
- In order to make API calls you need to register a device and open a session.
- We use RSA Keys for signatures headers and encryption.
- API calls must contain a valid authentication token in the headers.
- The auto logout time that you've set for your user account is also effective for your sessions. If a request is made 30 minutes before a session expires, the session will automatically be extended.
## Device Registration

### Using our SDKs

1. In order to start making calls with the bunq API, you must first register your API key and device and create a session.
2. In the SDKs, we group these actions and call it "creating an API context".
3. You can find more information on our [GitHub](https://github.com/bunq) page.

### Using our API

1. Create an Installation with the installation POST call and provide a new public key. After doing so you receive an authentication token which you can use for the API calls in the next steps.
2. Create a DeviceServer with the device-server POST call and provide a description and API key.
3. Create a SessionServer with the session-server POST call. After doing so you receive a new authentication token which you can use for the API calls during this active Session.​
### IP addresses

When using a standard API Key the DeviceServer and Installation that are created in this process are bound to the IP address they are created from. Afterwards it is only possible to add IP addresses via the Permitted IP endpoint.

Using a Wildcard API Key gives you the freedom to make API calls from any IP address after the POST device-server. You can switch to a Wildcard API Key by tapping on “Allow All IP Addresses” in your API Key menu inside the bunq app. Find out more at this link https://bunq.com/en/apikey-dynamic-ip.

# Signing

To avoid modification of API call data while in transit (i.e. man-in-the-middle attacks), we use a request/response signing system. The signature ensures that the data is coming from the party that has the correct private key.

While this system is already implemented in our SDKs, you should always follow the guidelines on this page when using the bunq API to make sure you correctly sign your calls.

The signatures are created using the SHA256 cryptographic hash function and included (encoded in base 64) in the `X-Bunq-Client-Signature` request header and `X-Bunq-Server-Signature` response header. The data to sign is the following:

- For requests: the request method, capitalized, and request endpoint URL (including the query string, if any). Do not use the full URL. `POST /v1/user` works; `POST https://sandbox.public.api.bunq.com/v1/user` will not.
- For responses: the response code.
- A `\n` (linefeed) newline separator.
- Headers, sorted alphabetically by key, with key and value separated by `: ` (a colon followed by a space) and only including `Cache-Control`, `User-Agent` and headers starting with `X-Bunq-`. The headers should be separated from each other with a `\n` (linefeed) newline. For a full list of required call headers, see the headers page.
- Two `\n` (linefeed) newlines (even when there is no body).
- The request or response body.
- For signing requests, the client must use the private key corresponding to the public key that was sent to the server in the installation API call. That public key is what the server will use to verify the signature when it receives the request. In that same call the server will respond with a server side public key, which the client must use to verify the server's signatures. The generated RSA key pair must have key lengths of 2048 bits and adhere to the PKCS #8 standard.

## Request signing example

Consider the following request, a `POST` to `/v1/user/126/monetary-account/222/payment` (the JSON is formatted with newlines and indentations to make it more readable):

| Header | Value |
| ------ | ----- |
| Cache-Control: | no-cache|
| User-Agent: | bunq-TestServer/1.00 sandbox/0.17b3|
| X-Bunq-Client-Authentication: | f15f1bbe1feba25efb00802fa127042b54101c8ec0a524c36464f5bb143d3b8b|
| X-Bunq-Client-Request-Id: | 57061b04b67ef|
| X-Bunq-Client-Signature: | UINaaJELGHekiye4JExGx6TCs2lKMta74oVlZlwVNuVD6xPpH7RS6H58C21MmiQ75/MSVjUePC8gBjtARW2HpUKN7hANJqo/UtDb7mgDMsuz7Cf/hKeUCX0T55w2X+NC3i1T+QOQVQ1gALBT1Eif6qgyyY1wpWJUYft0MmCGEYg/ao9r3g026DNlRmRpBVxXtyJiOUImuHbq/rWpoDZRQTfvGL4KH4iKV4Lcb+o9lw11xOl4LQvNOHq3EsrfnTIa5g80pg9TS6G0SvjWmFAXBmDXatqfVhImuKZtd1dQI12JNK/++isBsP79eNtK1F5rSksmsTfAeHMy7HbfAQSDbg==|
| X-Bunq-Geolocation: | 0 0 0 0 NL|
| X-Bunq-Language: | en\_US|
| X-Bunq-Region: | en\_US|

```json
{
	"amount": {
		"value": "12.50",
		"currency": "EUR"
	},
	"counterparty_alias": {
		"type": "EMAIL",
		"value": "bravo@bunq.com"
	},
	"description": "Payment for drinks."
}
```

Let's sign that request (using PHP example code). First create a variable `$dataToSign`, starting with the type and endpoint url. Follow that by a list of headers only including `Cache-Control`, `User-Agent` and headers starting with `X-Bunq-`. Add an extra (so double) linefeed after the list of headers. Finally end with the body of the request:

`POST /v1/user/126/monetary-account/222/payment`

| Header | Value |
| ------ | ----- |
| Cache-Control: | no-cache|
| User-Agent: | bunq-TestServer/1.00 sandbox/0.17b3|
| X-Bunq-Client-Authentication: | f15f1bbe1feba25efb00802fa127042b54101c8ec0a524c36464f5bb143d3b8b|
| X-Bunq-Client-Request-Id: | 57061b04b67ef|
| X-Bunq-Geolocation: | 0 0 0 0 NL|
| X-Bunq-Language: | en\_US|
| X-Bunq-Region: | en\_US|

```json
{"amount":{"value":"12.50","currency":"EUR"},"counterparty\_alias":{"type":"EMAIL","value":"bravo@bunq.com"},"description":"Payment for drinks."}
```
Next, create the signature of `$dataToSign` using the SHA256 algorithm and the private key `$privateKey` of the Installation's key pair. In PHP, use the following to create a signature. The signature will be passed by reference into `$signature`.

`openssl_sign($dataToSign, $signature, $privateKey, OPENSSL_ALGO_SHA256);`

Encode the resulting `$signature` using base64, and add the resulting value to the request under the header `X-Bunq-Client-Signature`. You have now signed your request, and can send it!

## Response verifying example

The response to the previous request is as follows (the JSON is formatted with newlines and indentations to make it more readable):

| Header | Value |
| ------ | ----- |
| Access-Control-Allow-Origin: |* |
| Content-Type: | application/json|
| Date: | Thu, 07 Apr 2016 08:32:04 GMT|
| Server: | Apache|
| Strict-Transport-Security: | max-age=31536000|
| Transfer-Encoding: | chunked|
| X-Bunq-Client-Response-Id: | 89dcaa5c-fa55-4068-9822-3f87985d2268|
| X-Bunq-Client-Request-Id: | 57061b04b67ef|
| X-Bunq-Server-Signature: | ee9sDfzEhQ2L6Rquyh2XmJyNWdSBOBo6Z2eUYuM4bAOBCn9N5vjs6k6RROpagxXFXdGI9sT15tYCaLe5FS9aciIuJmrVW/SZCDWq/nOvSThi7+BwD9JFdG7zfR4afC8qfVABmjuMrtjaUFSrthyHS/5wEuDuax9qUZn6sVXcgZEq49hy4yHrV8257I4sSQIHRmgds4BXcGhPp266Z6pxjzAJbfyzt5JgJ8/suxgKvm/nYhnOfsgIIYCgcyh4DRrQltohiSon6x1ZsRIfQnCDlDDghaIxbryLfinT5Y4eU1eiCkFB4D69S4HbFXYyAxlqtX2W6Tvax6rIM2MMPNOh4Q==|
| X-Frame-Options: | SAMEORIGIN|

```json
{
	"Response": [
		{
			"Id": {
				"id": 1561
			}
		}
	]
}
```
Now we need to verify that this response actually came from the server and not from a man-in-the-middle. So, first we built the data that is to be verified, starting with the response code (200). Follow this by a list of the bunq headers (sorted alphabetically and excluding the signature header itself). Note: you should only include headers starting with X-Bunq-, so omit headers like Cache-Control for the verification of the response. Finally, add two line feeds followed by the response body. Note: The headers might change in transit from `X-Header-Capitalization-Style` to `x-header-non-capitalization-style`. Make sure you change them to `X-Header-Capitalization-Style` before verifying the response signature.
```
200
X-Bunq-Client-Request-Id: 57061b04b67ef
X-Bunq-Server-Response-Id: 89dcaa5c-fa55-4068-9822-3f87985d2268

{"Response":[{"Id":{"id":1561}}]}
```
Now, verify the signature of `$dataToVerify` using the SHA256 algorithm and the public key `$publicKey` of the server. In PHP, use the following to verify the signature.

`openssl_sign($dataToVerify, $signature, $publicKey, OPENSSL_ALGO_SHA256);`

## Troubleshooting

If you get an error telling you "The request signature is invalid", please check the following:

- There are no redundant characters (extra spaces, trailing line breaks, etc.) in the data to sign.
- In your data to sign, you have used only the endpoint URL, for instance POST /v1/user, and not the full url, for instance `POST https://sandbox.public.api.bunq.com/v1/user`
- You only added the headers `Cache-Control`, `User-Agent` and headers starting with `X-Bunq-`.
- In your data to sign, you have sorted the headers alphabetically by key, ascending.
- There is a colon followed by a space `: ` separating the header key and value in your data to sign.
- There is an extra line break after the list of headers in the data to sign, regardless of whether there is a request body.
- Make sure the body is appended to the data to sign exactly as you're adding it to the request.
- In your data to sign, you have not added the `X-Bunq-Client-Signature` header to the list of headers (that would also be impossible).
- You have added the full body to the data to sign.
- You use the data to sign to create a SHA256 hash signature.
- You have base64 encoded the SHA256 hash signature before adding it to the request under `X-Bunq-Client-Signature`.

# Headers

HTTP headers allow your client and bunq to pass on additional information along with the request or response.

While this is already implemented in our [SDKs](https://github.com/bunq), please follow these instructions to make sure you set appropriate headers for calls if using bunq API directly.

## Request Headers

### Mandatory request headers

#### Cache-Control

`Cache-Control: no-cache`

The standard HTTP Cache-Control header is required for all requests.

#### User-Agent

`User-Agent: bunq-TestServer/1.00 sandbox/0.17b3`

The User-Agent header field should contain information about the user agent originating the request. There are no restrictions on the value of this header.

#### X-Bunq-Language

`X-Bunq-Language: en_US`

The X-Bunq-Language header must contain a preferred language indication. The value of this header is formatted as a ISO 639-1 language code plus a ISO 3166-1 alpha-2 country code, separated by an underscore.

Currently only the languages en_US and nl_NL are supported. Anything else will default to en_US.

#### X-Bunq-Region

`X-Bunq-Region: en_US`

The X-Bunq-Region header must contain the region (country) of the client device. The value of this header is formatted as a ISO 639-1 language code plus a ISO 3166-1 alpha-2 country code, separated by an underscore.

#### X-Bunq-Client-Request-Id

`X-Bunq-Client-Request-Id: a4f0de`

This header must specify an ID with each request that is unique for the logged in user. There are no restrictions for the format of this ID. However, the server will respond with an error when the same ID is used again on the same DeviceServer.

#### X-Bunq-Geolocation

`X-Bunq-Geolocation: 4.89 53.2 12 100 NL`

`X-Bunq-Geolocation: 0 0 0 0 000`

This header must specify the geolocation of the device. The format of this value is longitude latitude altitude radius country. The country is expected to be formatted of an ISO 3166-1 alpha-2 country code. When no geolocation is available or known the header must still be included but can be zero valued.

#### X-Bunq-Client-Signature

`X-Bunq-Client-Signature: XLOwEdyjF1d+tT2w7a7Epv4Yj7w74KncvVfq9mDJVvFRlsUaMLR2q4ISgT+5mkwQsSygRRbooxBqydw7IkqpuJay9g8eOngsFyIxSgf2vXGAQatLm47tLoUFGSQsRiYoKiTKkgBwA+/3dIpbDWd+Z7LEYVbHaHRKkEY9TJ22PpDlVgLLVaf2KGRiZ+9/+0OUsiiF1Fkd9aukv0iWT6N2n1P0qxpjW0aw8mC1nBSJuuk5yKtDCyQpqNyDQSOpQ8V56LNWM4Px5l6SQMzT8r6zk5DvrMAB9DlcRdUDcp/U9cg9kACXIgfquef3s7R8uyOWfKLSNBQpdVIpzljwNKI1Q`

The signature header is included for all API calls except for POST /v1/installation. See the signing page for details on how to create this signature.

#### X-Bunq-Client-Authentication

`X-Bunq-Client-Authentication: 622749ac8b00c81719ad0c7d822d3552e8ff153e3447eabed1a6713993749440`

The authentication token is used to authenticate the source of the API call. It is required by all API calls except for POST /v1/installation. It is important to note that the device and session calls are using the token from the response of the installation call, while all the other calls use the token from the response of the session-server call

### Attachment headers

#### Content-Type

`Content-Type: image/jpeg`

This header should be used when uploading an attachment to pass its MIME type. Supported types are: image/png, image/jpeg and image/gif.

#### X-Bunq-Attachment-Description
X-Bunq-Attachment-Description: Check out these cookies.
This header should be used when uploading an Attachment's content to give it a description.

## Response Headers

### All Responses

####  X-Bunq-Client-Request-Id

`X-Bunq-Client-Request-Id: a4f0de`

The same ID that was provided in the request's X-Bunq-Client-Request-Id header. Is included in the response (and request) signature, so can be used to ensure this is the response for the sent request.

#### X-Bunq-Client-Response-Id

`X-Bunq-Client-Response-Id: 76cc7772-4b23-420a-9586-8721dcdde174`

A unique ID for the response formatted as a UUID. Clients can use it to add extra protection against replay attacks.

#### X-Bunq-Server-Signature

`X-Bunq-Server-Signature: XBBwfDaOZJapvcBpAIBT1UOmczKqJXLSpX9ZWHsqXwrf1p+H+eON+TktYksAbmkSkI4gQghw1AUQSJh5i2c4+CTuKdZ4YuFT0suYG4sltiKnmtwODOFtu1IBGuE5XcfGEDDSFC+zqxypMi9gmTqjl1KI3WP2gnySRD6PBJCXfDxJnXwjRkk4kpG8Ng9nyxJiFG9vcHNrtRBj9ZXNdUAjxXZZFmtdhmJGDahGn2bIBWsCEudW3rBefycL1DlpJZw6yRLoDltxeBo7MjgROBpIeElh5qAz9vxUFLqIQC7EDONBGbSBjaXS0wWrq9s2MGuOi9kJxL2LQm/Olj2g==`

The server's signature for this response. See the signing page for details on how to verify this signature.

# Errors

Familiar HTTP response codes are used to indicate the success or failure of an API request.

Generally speaking, codes in the 2xx range indicate success, while codes in the 4xx range indicate an error having to do with provided information (e.g. a required parameter was missing, insufficient funds, etc.).

Finally, codes in the 5xx range indicate an error with bunq servers. If this is the case, please stop by the support chat and report it to us.

## Response Codes

| Code | Error | Description |
| ---- | ----- | ----------- |
| 200 | OK | Successful HTTP request.|
| 399 | NOT MODIFIED | Same as a 304, it implies you have a local cached copy of the data.|
| 400 | BAD REQUEST | Most likely a parameter is missing or invalid.|
| 401 | UNAUTHORISED | Token or signature provided is not valid.|
| 403 | FORBIDDEN | You're not allowed to make this call.|
| 404 | NOT FOUND | The object you're looking for cannot be found.|
| 405 | METHOD NOT ALLOWED | The method you are using is not allowed for this endpoint.|
| 429 | RATE LIMIT | Too many API calls have been made in a too short period.|
| 490 | USER ERROR | Most likely a parameter is missing or invalid.|
| 491 | MAINTENANCE ERROR | bunq is in maintenance mode.|
| 500 | INTERNAL SERVER ERROR | Something went wrong on bunq's end.|

All errors 4xx code errors will include a JSON body explaining what went wrong.

## Rate Limits

If you are receiving the error 429, please make sure you are sending requests at rates that are below our rate limits.

Our rate limits per IP address per endpoint:

- GET requests: 3 within any 3 consecutive seconds
- POST requests: 5 within any 3 consecutive seconds
- PUT requests: 2 within any 3 consecutive seconds

# API Conventions

Make sure to follow these indications when using the bunq API or get started with our SDKs.

## Responses

All JSON responses have one top level object. In this object will be a Response field of which the value is always an array, even for responses that only contain one object.

Example response body

```json
{
	"Response": [
		{
			"DataObject": {}
		}
	]
}
```

## Errors

- Error responses also have one top level Error object.
- The contents of the array will be a JSON object with an error_description and error_description_translated field.
- The error_description is an English text indicating the error and the error_description_translated field can be shown to end users and is translated into the language from the X-Bunq-Language header, defaulting to en_US.
- When using bunq SDKs, error responses will be always raised in form of an exception.

Example response body
```json
{
	"Error": [
		{
			"error_description": "Error description",
			"error_description_translated": "User facing error description"
		}
	]
}
```

## Object Type Indications

When the API returns different types of objects for the same field, they will be nested in another JSON object that includes a specific field for each one of them. Within bunq SDKs a BunqResponse object will be returned as the top level object.

In this example there is a field content, which can have multiple types of objects as value such as — in this case — ChatMessageContentText. Be sure to follow this convention or use bunq SDKs instead.

```json
{
	"content": {
		"ChatMessageContentText": {
			"text": "Hi! This is an automated security message. We saw you just logged in on an My Device Description. If you believe someone else logged in with your account, please get in touch with Support."
		}
	}
}
```

## Time Formats

Times and dates being sent to and from the API are in UTC. The format that should be used is `YYYY-MM-DD hh:mm:ss.ssssss`, where the letters have the meaning as specified in ISO 8601. For example: `2017-01-13 13:19:16.215235`.

# Callbacks

Callbacks are used to send information about events on your bunq account to a URL of your choice, so that you can receive real-time updates.

## Notification Filters

In order to receive notifications for certain activities on your bunq account, you have to create notification filters. These can be set for your UserPerson or UserCompany, MonetaryAccount or CashRegister.

The `notification_filters` object looks like this:

```json    
    {
        "notification_filters": [
            {
                "notification_delivery_method": "URL",
                "notification_target": “{YOUR_CALLBACK_URL}",
                "category": "REQUEST"
            },
            {
                "notification_delivery_method": "URL",
                "notification_target": "{YOUR_CALLBACK_URL}",
                "category": "PAYMENT"
            }
        ]
    }
```

### Notification Filter Fields

- `notification_delivery_method`: choose between URL (sending an HTTP request to the provided URL) and PUSH (sending a push notification to user's phone). To receive callbacks, a notification has to be set for URL.
- `notification_target`: provide the URL you want to receive the callbacks on. This URL must use HTTPS.
- `category`: provides for which type of events you would like to receive a callback.

### Callback categories


| Category | Description |
| -------- | ----------- |
| BILLING | notifications for all bunq invoices.|
| CARD_TRANSACTION_SUCCESSFUL | notifications for successful card transactions.|
| CARD_TRANSACTION_FAILED | notifications for failed card transaction.|
| CHAT | notifications for received chat messages.|
| DRAFT_PAYMENT | notifications for creation and updates of draft payments.|
| IDEAL | notifications for iDEAL-deposits towards a bunq account.|
| SOFORT | notifications for SOFORT-deposits towards a bunq account.|
| MUTATION | notifications for any action that affects a monetary account’s balance.|
| PAYMENT | notifications for payments created from, or received on a bunq account (doesn’t include payments that result out of paying a Request, iDEAL, Sofort or Invoice). Outgoing payments have a negative value while incoming payments have a positive value.|
| REQUEST | notifications for incoming requests and updates on outgoing requests.|
| SCHEDULE_RESULT | notifications for when a scheduled payment is executed.|
| SCHEDULE_STATUS | notifications about the status of a scheduled payment, e.g. when the scheduled payment is updated or cancelled.|
| SHARE | notifications for any updates or creation of Connects (ShareInviteBankInquiry).|
| TAB_RESULT | notifications for updates on Tab payments.|
| BUNQME_TAB | notifications for updates on bunq.me Tab (open request) payments.|

### Mutation Category

A Mutation is a change in the balance of a monetary account. So, for each payment-like object, such as a request, iDEAL-payment or a regular payment, a Mutation is created. Therefore, the `MUTATION` category can be used to keep track of a monetary account's balance.

### Receiving Callbacks

***NOTICE***: We're changing the origin of our callbacks for sandbox to originate from the Amazon network.

Callbacks for the sandbox environment will be made from AWS starting May 28th 2018.  
Callbacks for the production environment will be made from 185.40.108.0/22.

Until 2018-06-09 we'll continue to send callbacks from:

- `185.40.109.64` callback outgoing IP production.
- `185.40.109.65` callback outgoing IP production.
- `185.40.111.64` callback outgoing IP production.
- `185.40.111.65` callback outgoing IP production.

*The IP addresses might change*. We will notify you in a timely fashion if such a change would take place.

### Retry mechanism

When the execution of a callback fails (e.g. if the callback server is down or the response contains an error) it is tried again for a maximum of 5 times, with an interval of one minute between each try. If your server is not reachable by the callback after the 6th total try, the callback is not sent anymore.

## Certificate Pinning

We recommend you use certificate pinning as an extra security measure. With certificate pinning, we check the certificate of the server on which you want to receive callbacks against the pinned certificate that has been provided by you and cancel the callback if that check fails.

### How to set up certificate pinning

Retrieve the SSL certificate of your server using the following command:

1. `openssl s_client -servername www.example.com -connect www.example.com:443 < /dev/null | sed -n "/-----BEGIN/,/-----END/p" > www.example.com.pem`
2. `POST` the certificate to the certificate-pinned endpoint.

Now every callback that is made will be checked against the pinned certificate that you provided. Note that if the SSL certificate on your server expires or is changed, our callbacks will fail.

# Pagination

In order to control the size of the response of a `LIST` request, items can be paginated. A `LIST` request is a request for every one of a certain resources, for instance all payments of a certain monetary account `GET /v1/user/1/monetary-account/1/payment`). You can decide on the maximum amount of items of a response by adding a `count` query parameter with the number of items you want per page to the URL. For instance:

`GET /v1/user/1/monetary-account/1/payment?count=25`

When no `count` is given, the default count is set to 10. The maximum `count` you can set is 200.

With every listing, a `Pagination` object will be added to the response, containing the URLs to be used to get the next or previous set of items. The URLs in the Pagination object can be used to navigate through the listed resources. The Pagination object looks like this given a count of 25:

```json
"Pagination": {
    "future_url": null,
    "newer_url": "/v1/user/1/monetary-account/1/payment?count=25&newer_id=249",
    "older_url": "/v1/user/1/monetary-account/1/payment?count=25&older_id=224"
}
```

The `newer_url` value can be used to get the next page. The `newer_id` is always the ID of the last item in the current page. If `newer_url` is `null`, there are no more recent items before the current page.

The `older_url` value can be used to get the previous page. The `older_id` is always the ID of the first item in the current page. If `older_url` is `null`, there are no older items after the current page.

The `future_url` can be used to refresh and check for newer items that didn't exist when the listing was requested. The `newer_id` will always be the ID of the last item in the current page. `future_url` will be `null` if `newer_id` is not also the ID of the latest item.

# Moving to Production

Have you tested your bunq integration to the fullest and are you now ready to introduce it to the world? Then the time has come to move it to a production environment!

To get started you'll need some fresh API keys for the production environment, which you can create via your bunq app. You can create these under "Profile" by tapping the "Security" menu. We do, however, highly recommend using a standard API Key instead of a Wildcard API Key. The former is significantly safer and it protects you from intrusions and possible attacks.

There's only a few things to do before your beautiful bunq creation can be moved to production. You're going to have to change your API Key and redo the sequence of calls to open a session.

The bunq Public API production environment is hosted at `https://api.bunq.com`.

Do you have any questions or remarks about the process, or do you simply want to show off with your awesome creations? Don't hesitate to drop us a line on [together.bunq.com](https://together.bunq.com).

# Android Emulator

In case you do not own an Android device on which you can run our Sandbox app for end-to-end testing, you can set up an emulator to run the bunq Sandbox app for Android.

Things you will need

- The [bunq Sandbox App APK](https://appstore.bunq.com/api/android/builds/bunq-android-sandbox-master.apk) that's optimised for emulating;
- [Android Studio](https://developer.android.com/studio/index.html).

Starting the Android Virtual Device (AVD) Manager

1. Open Android Studio.
2. From the top menu, select “Tools” > "Android" > "AVD Manager".

Setting up a new virtual device

1. Start the wizard by clicking on "+ Create Virtual Device".
2. Select a device (recommendation: "Pixel 5.0" or "Nexus 6") and press "Next".
3. Select an x86 system image (recommendation: Nougat, API Level 25, Android 7.1.1 with Google APIs) and press "Next". The image needs to have Google Play Services 10.0.1 or higher.
4. In the bottom left corner, select "Show Advanced Settings".
5. Scroll to "Memory and Storage".
6. Change "Internal Storage" to "2048 MB".
7. Change "SD card" to "200 MB".
8. Press "Finish".

Starting the virtual device

1. On the right side under "Actions", select the green "Play" button.
2. Wait for the device to boot, this may take a few minutes.

Installing the bunq Sandbox App APK

1. Open the command line.
2. Navigate to your Android SDK platform tools directory (e.g. `cd ~/Library/Android/sdk/platform-tools` on macOS).
3. Make sure that the virtual device is started and has fully booted.
4. Run `./adb install ~/Downloads/bunq-android-sandboxEmulator-public-api.apk`, this may take a few minutes, and should finish with "Success".

Creating an account or logging in

- Follow the steps on the virtual device to create an account or to login.

> Tested with Android Studio 2.3 (February 24th, 2017)

# Quickstart: Opening a Session

## Goal

So, you want to start using the bunq API, awesome! To do this, you have to open a session in which you will be making those calls.

## Preperations

To connect to the API, you have to make sure you have received an API key. For the production environment, you can generate your own keys in the bunq app (under 'Profile' -> 'Security'). For the sandbox environment you can request a key through Support chat in the bunq app.

## Create a new API key

To create additional API keys for the sandbox environment, log in to the sandbox app for Android as either a UserPerson or UserCompany. Navigate to Profile > Security > API keys and click the '+' button. Please be aware that the API key can only be assigned to an IP within 4 hours after its creation. After the 4 hours, it will become invalid if not assigned. API keys that are created via the sandbox app are wiped with each sandbox reset.

## Call Sequence

The calls you need to perform to set up a session from scratch are the following:

### 1. POST installation

Each call needs to be signed with your own private key. An Installation is used to tell the server about the public key of your key pair. The server uses this key to verify your subsequent calls.

Start by generating a 2048-bit RSA key pair. You can find out how to generate a key pair in our PHP coding examples.

#### Headers

On the headers page you can find out about the mandatory headers. Take care that if you are in the sandbox environment, you set an `Authorization` header. Specific to the `POST /installation` call, you shouldn't use the `X-Bunq-Client-Authentication` or the `X-Bunq-Client-Signature` headers.

#### Body

Post your public key to the Installation endpoint (use `\n` for newlines in your public key).

#### Response

Save the Installation token and the bunq API's public key from the response. This token is used in the `Authentication` header to register a `DeviceServer` and to start a `SessionServer`. The bunq API's public key should be used to verify future responses received from the bunq API.

### 2. POST device-server

Further calls made to the server need to come from a registered device. `POST /device-server` registers your current device and the IP address(es) it uses to connect to the bunq API.

#### Headers

Use the token you received from `POST /installation` in the `X-Bunq-Client-Authentication` header. Make sure you sign your call, passing the call signature in `X-Bunq-Client-Signature` header.

#### Body

For the secret, use the API key you received. If you want to create another API key, you can do so in the bunq sandbox app (or production app for the production environment). Login, go to Profile > Security and tap 'API keys'. The freshly created API key can be assigned to one or multiple IP addresses using `POST device-server` within 4 hours before becoming invalid. As soon as you start using your API key, it will remain valid until the next sandbox reset.   For the secret, use the API key you received.

### 3. POST session-server

To make any calls besides `installation` and `device-server`, you need to open a session.

#### Headers

Use the token you received from `POST /installation` in the `X-Bunq-Client-Authentication` header. Make sure you sign your call, passing the call signature in `X-Bunq-Client-Signature` header.

#### Body

For the secret, use the API key you received.

#### Response

The token received in the response to `POST /session-server` should be used to authenticate your calls in this session. Pass this session's token in the `X-Bunq-Client-Authentication` header on every call you make in this session.

# Quickstart: Payment Request

## Goal

You want to offer bunq payments on a website or in an application.

## Scenario

In this use case the consumer and the merchant both have a bunq account. The consumer wants to pay with bunq and enters their alias in the bunq payment field at checkout. The merchant sends the request for payment to the consumer when the consumer presses enter. The consumer agrees to the request in the bunq mobile app and the merchant has immediate confirmation of the payment.

## Before you start

Make sure that you have opened a session and that for any call you make after that, you pass the session’s token in the X-Bunq-Client-Authentication header.

## Call Sequence

The consumer is at checkout and selects the bunq payment method. This would be a logical time to open a session on the bunq server.

### 1. LIST monetary-account

When a request for payment is accepted, the money will be deposited on the bank account the request for payment is connected to. Let’s start by finding all your available bank accounts. Pick one of them to make the request for payment with and save its `id`.

### 2. POST monetary-account attachment (optional)

Optionally, you can attach an image to the request for payment.

#### Headers
Make sure you set the `Content-Type` header to match the MIME type of the image. It’s also required you pass a description of the image via the `X-Bunq-Attachment-Description` header.

#### Body
The payload of this request is the binary representation of the image file. Do not use any JSON formatting.

#### Response
Save the `id` of the posted attachment. You’ll need it to attach it to the request for payment.

### 3. POST request-inquiry

Next, create a request inquiry. A request inquiry is the request for payment that your customer can respond to by accepting or rejecting it.

#### Body

Pass the customer’s email address, phone number or IBAN in the `counterparty_alias`. Make sure you set the correct `type` for the alias, depending on what you pass. When providing an IBAN, a name of the `counterparty_alias` is required. You can provide the `id` of the created attachment.

#### Response

You will receive the `id` of the created request inquiry in the response. Save this `id`. You will need it to check if the customer has responded to the request yet.

### 4. GET request-inquiry

After you’ve sent the request for payment, its status can be checked.

#### Response

When the `status` is `ACCEPTED`, the customer has accepted and paid the request, and you will have received the money on the connected monetary account. If the `status` is `REJECTED`, the customer did not accept the request.

# Quickstart: Create a Tab payment

## Goal
You will create a tab that can be paid once by a single user, a so called TagUsageSingle, and explore three different ways to make the Tab visible to your customers:

- QR code from the CashRegister
- QR code from the Tab.

## Before you start

Make sure that you have opened a session and that for any call you make after that, you pass the session’s token in the `X-Bunq-Client-Authentication` header.

## Call Sequence

### 1. POST attachment-public

Start by creating an attachment that will be used for the avatar for the cash register.

#### Header

Make sure you set the `Content-Type` header to match the MIME type of the image. It is also required you pass a description of the image via the `X-Bunq-Attachment-Description` header.

#### Body

The payload of this request is the binary representation of the image file. Do not use any JSON formatting.

#### Response

Save the `uuid` of the posted attachment. You'll need it to create the avatar in the next step.

### 2. POST avatar

Make an avatar using the public attachment you've just created.

#### Body

The payload of this request is the `uuid` of the attachment public.

#### Response

In response, you’ll receive the UUID of the avatar created using the attachment. Save this UUID. You’ll use it as the avatar for the cash register you're about to create.

### 3. LIST monetary-account

Get a listing of all available monetary accounts. Choose one, and save the id of the monetary account you want your cash register to be connected to. Each paid tab for the cash register will transfer the money to this account.

### 4a. POST cash-register

Create a cash register. Use the `id` of the monetary account you want to connect the cash register to in the URL of the request.

#### Body

In the body provide the `uuid` of the avatar you created for this cash register. Also make sure to provide a unique name for your cash register. Set the status to `PENDING_APPROVAL`.

#### Response

The response contains the `id` of the cash register you created. Save this `id`. You will need it to create subsequent tabs and tab items.

### 4b. Wait for approval

On the production environment, a bunq admin will review and approve your cash register. In the sandbox environment, your cash register will be automatically approved.

### 5. POST tab-usage-single

Create a new tab that is connected to your cash register. Use the id of the cash register you want to connect this tab to in the URL of your request.

#### Body

Give the tab a name in `merchant_reference`. Create the tab with status `OPEN`, and give the tab a starting amount. You can update this amount later.

#### Response

The response contains the uuid of the tab you created.

### 6. POST tab-item (optional)

You can add items to a tab. For instance, if a customer will be paying for multiple products via this tab, you can decide to add an item for each of these. Adding items to a tab is optional, and adding them will not change the total amount of the tab itself. However, if you've added any tab items the sum of the amounts of these items must be equal to the `total_amount` of the tab when you change its status to `WAITING_FOR_PAYMENT`.

### 7. PUT tab-usage-single

Update the status of the tab to `WAITING_FOR_PAYMENT` if you want the costumer to pay the tab, and you're done adding any tab items. You can use this request to make the tab visible for your costumers.

#### Visibility

To decide how you are going to make your tab visible, pass a visibility object in the payload.

Setting `cash_register_qr_code` to true will connect this tab to the QR code from the cash register. If this cash register does not have a QR code yet, one will be created. Only one Tab can be connected to the cash register’s QR code at any given time.

Setting `tab_qr_code` to true will create a QR code specifically for this tab. This QR code can not be linked to anything else.