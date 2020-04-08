***UPDATE:*** *We have released a [beta version of the new bunq API documentation.](https://beta.doc.bunq.com)*

***NOTICE:***  *We have updated the sandbox base url to `https://public-api.sandbox.bunq.com/v1/`. Please update your applications accordingly. Check here: <https://github.com/bunq/sdk_php/issues/149> for more info.*

***PSD2 NOTICE:*** *The second Payment Services Directive (PSD2) may affect your current or planned usage of our public API, as some of the API services are now subject to a permit. Please be aware that using our public API without the required PSD2 permit is at your own risk and take notice of our updated API Terms and Conditions on <https://www.bunq.com> for more information.*

# <span id="topic-introduction">Introduction</span>

Welcome to bunq!

- The bunq API is organised around REST. JSON will be returned in almost all responses from the API, including errors but excluding binary (image) files.
- Please configure your implementation to send its API requests to `https://public-api.sandbox.bunq.com/v1/`
- There is a version of the [Android app](https://appstore.bunq.com/api/android/builds/bunq-android-sandbox-master.apk) that connects to the bunq Sandbox environment. To create accounts for the Sandbox app, please follow the steps in the [Android Emulator](#android-emulator) section.

## <span id="topic-introduction-get-started">Get started</span>

1. Create a user account with your phone. Afterwards, you can use this account to create an API key from which you can make API calls. You can find API key management under 'Profile' -\> 'Security'.
2. Register a device. A device can be a phone (private), computer or a server (public). You can register a new device by using the installation and device-server calls.
3. Open a session. Sessions are temporary and expire after the same amount of time you have set for auto logout in your user account.
4. Make your first call!

## <span id="topic-introduction-versioning">Versioning</span>

Developments in the financial sector, changing regulatory regimes and new feature requests require us to be flexible. This means we can iterate quickly to improve the API and related tooling. This also allows us to quickly process your feedback (which we are happy to receive!). Therefore, we have chosen not to attach any version numbers to the changes just yet. We will inform you in a timely manner of any important changes we make before they are deployed on together.bunq.com.

Once the speed of iteration slows down and more developers start using the API and its sandbox we will start versioning the API using the version number in the HTTP URLs (i.e. the `/v1` part of the path). We will inform you when this happens.

# <span id="topic-oauth">OAuth</span>

## <span id="topic-oauth-what-is-oauth">What is OAuth?</span>

[OAuth 2.0](https://www.oauth.com/oauth2-servers/getting-ready/) is a protocol that will let your app connect to bunq users in a safe and easy way. Please be aware that if you want to gain access to account information of other bunq users or initiate a payment for them, you [may require a PSD2 permit](https://beta.doc.bunq.com/other/faq#is-it-possible-to-provide-services-to-third-parties-by-means-of-the-bunq-api-without-a-license).

## <span id="topic-oauth-get-started-with-oauth-for-bunq">Get started with OAuth for bunq</span>

Follow these steps to get started with OAuth:
1. Register your OAuth Client in the bunq app, you will find the option within "Security & Settings > Developers".
2. Add one or more Redirect URLs.
3. Get your Client ID and Client Secret from the bunq app.
4. Redirect your users to the OAuth authorization URL as described [here](#oauth-authorization-request).
5. If the user accepts your Connection request then he will be redirected to the previously specified `redirect_uri` with an authorization Code parameter.
6. Use the [token endpoint](#oauth-token-exchange) to exchange the authorization Code for an Access Token.
7. The Access Token can be used as a normal API Key, open a session with the bunq API or use our SDKs and get started!

## <span id="topic-oauth-what-can-my-apps-do-with-oauth">What can my apps do with OAuth?</span>

We decided to launch OAuth with a default permission that allows you to perform the following actions:
- read and create Monetary Accounts;
- read Payments & Transactions;
- create Payments between Monetary Accounts of the same user;
- create Draft-Payments (the user will need to approve the payment using the bunq app);
- assign a Monetary account to a Card;
- read, create and manage Cards;
- read and create Request-Inquiries
- read Request-Responses.

## <span id="topic-oauth-authorization-request">Authorization request</span>

Your web or mobile app should redirect users to the following URL:

`https://oauth.bunq.com/auth`

The following parameters should be passed:

- `response_type` - bunq supports the authorization code grant, provide `code` as parameter (required)
- `client_id` - your Client ID, get it from the bunq app (required)
- `redirect_uri` - the URL you wish the user to be redirected after the authorization, make sure you register the Redirect URL in the bunq app (required)
- `state` - a unique string to be passed back upon completion (optional)

Use `https://oauth.sandbox.bunq.com/auth` in the sandbox environment.

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
## <span id="topic-oauth-token-exchange">Token exchange</span>

If everything went well then you can exchange the authorization Code that we returned you for an Access Token to use with the bunq API.

Make a POST call to the following endpoint:

`https://api.oauth.bunq.com/v1/token`

The following parameters should be passed as GET variables:

- `grant_type` - the grant type used, `authorization_code` for now (required)
- `code` -  the authorization code received from bunq (required)
- `redirect_uri` - the same Redirect URL used in the authorisation request (required)
- `client_id` - your Client ID (required)
- `client_secret` - your Client Secret (required)

Use `https://api-oauth.sandbox.bunq.com/v1/token` in the sandbox environment.

**Token request example:**

```
https://api.oauth.bunq.com/v1/token?grant_type=authorization_code
&code=7d272be434a75933f40c13d56aef6c31496005b653074f7d6ac57029d9995d30
&redirect_uri=https://www.bunq.com/
&client_id=1cc540b6e7a4fa3a862620d0751771500ed453b0bef89cd60e36b7db6260f813
&client_secret=184f969765f6f74f53bf563ae3e9f891aec9179157601d25221d57f2f1151fd5
```

Note: the request only contains URL parameters.

**Example successful response:**

```json
{
    "access_token": "8baec0ac1aafca3345d5b811042feecfe0272514c5d09a69b5fbc84cb1c06029",
    "token_type": "bearer",
    "state": "594f5548-6dfb-4b02-8620-08e03a9469e6"
}
```

**Example error response:**

```json
{
    "error": "invalid_grant",
    "error_description": "The authorization code is invalid or expired."
}
```

## <span id="topic-oauth-using-the-connect-button">Using the Connect button</span>

All good? Ready to connect to your bunq users? Refer to our style guide and use the following assets when implementing the **Connect to bunq** button.

- [Style guide](https://bunq.com/info/oauth-styleguide)
- [Connect button assets](https://bunq.com/info/oauth-connect-buttons)

## <span id="topic-oauth-whats-next">What's next?</span>

The `access_token` you've received can be used as a normal API key. Please continue with [Authentication](#authentication).

**NOTE:** When connecting to a bunq user's account using OAuth, you create a new user that `access_token` is associated with. This user has an ID. Use this ID as the user ID instead of the primary ID of the user that you connected with via OAuth.

When calling `GET /user/{userID}`, you might expect to get `UserPerson` or `UserCompany`. Instead, you will get the `UserApiKey` object, which contains references to both the user that requested access *(you)* and the user that granted access *(the bunq user account that you connected to)*. 

![bunq_OAuth UserApiKey](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LbhJLuxCAKl5yUuS74T%2F-LuhS4YOAX9bwW1eGYF8%2F-LuhnlwEcVXtLVk6846Z%2FUserApiKey%20creation%20(3).jpg?alt=media&token=d1f212a2-3105-4f0e-a980-34b04a12998a)

Visit us on together.bunq.com, share your creations, ask question and build your very own bunq app!

# <span id="topic-authentication">Authentication</span>

- We use encryption for all API calls. This means that all requests must use HTTPS. The HTTP standard calls will fail. You should also use SSL Certificate Pinning and Hostname Verification to ensure a secure connection with bunq.
- In order to make API calls you need to register a device and open a session.
- We use RSA Keys for signatures headers and encryption.
- API calls must contain a valid authentication token in the headers.
- The auto logout time that you've set for your user account is also effective for your sessions. If a request is made 30 minutes before a session expires, the session will automatically be extended.

## <span id="topic-authentication-device-registration">Device registration</span>

### <span id="topic-authentication-device-registration-using-our-sdks">Using our SDKs</span>

1. In order to start making calls with the bunq API, you must first register your API key and device and create a session.
2. In the SDKs, we group these actions and call it "creating an API context".
3. You can find more information on our [GitHub](https://github.com/bunq) page.

### <span id="topic-authentication-device-registration-using-our-api">Using our API</span>

1. Create an Installation with the installation POST call and provide a new public key. After doing so you receive an authentication token which you can use for the API calls in the next steps.
2. Create a DeviceServer with the device-server POST call and provide a description and API key.
3. Create a SessionServer with the session-server POST call. After doing so you receive a new authentication token which you can use for the API calls during this active Session.​

### <span id="topic-authentication-device-registration-ip-addresses">IP addresses</span>

When using a standard API Key the DeviceServer and Installation that are created in this process are bound to the IP address they are created from. Afterwards it is only possible to add IP addresses via the Permitted IP endpoint.

Using a Wildcard API Key gives you the freedom to make API calls from any IP address after the POST device-server. You can switch to a Wildcard API Key by tapping on “Allow All IP Addresses” in your API Key menu inside the bunq app. You can also programatically switch to a Wildcard API Key by passing your current ip and a `*` (asterisk) in the `permitted_ips` field of the device-server POST call. E.g: `["1.2.3.4", "*"]`.

Find out more at this link https://bunq.com/en/apikey-dynamic-ip.

# <span id="topic-psd2">Connect as a PSD2 service provider</span>

As a service provider, either an Account Information Service Provider (AISP) or Payment Initiation Service Provider (PISP), you have obtained or are planning to obtain a licence from your local supervisor. You will need your unique eIDAS certificate number to start using the PSD2-compliant bunq API on production.

We accept pseudo certificates in the sandbox environment so you could test the flow. You can generate a test certificate using this command:
```
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj '/CN=My App PISP AISP/C=NL'
```

## <span id="topic-psd2-register-as-a-service-provider">Register as a service provider</span>

Before you can read information on bunq users or initiate payments, you need to register a PSD2 account and receive credentials that will enable you to access the bunq user accounts. 

1. Execute `POST v1/installation` and get your installation *Token* with a unique random key pair.
1. Use the installation *Token* and your unique PSD2 certificate to call `POST v1/payment-service-provider-credential`. This will register your software. 
1. Receive your API key in return. It will identify you as a PSD2 bunq API user. You will use it to start an OAuth flow. The session will last 90 days. After it closes, start a new session using the same API key.
1. Register a device by using `POST v1/device-server` using the API key for the secret and passing the installation *Token* in the `X-Bunq-Client-Authentication` header. 
1. Create your first session by executing `POST v1/session-server`. Provide the installation *Token* in the `X-Bunq-Client-Authentication` header. You will receive a session *Token*. Use it in any following request in the `X-Bunq-Client-Authentication` header.

**NOTE.** The first session will last 1 hour. Start a new session within 60 minutes.

![bunq_PSD_party_identification](https://static.bunq.com/assets/doc/20190313_PSD_party_identification.jpg)

## <span id="topic-psd2-register-your-applicaton">Register your application</span>

Before you can start authenticating on behalf of a bunq user, you need to get *Client ID* and *Client Secret*, which will identify you in requests to the user accounts.

1. Call `POST /v1/user/{userID}/oauth-client`
1. Call `GET /v1/user/{userID}/oauth-client/{oauth-clientID}`. We will return your *Client ID* and *Client Secret*.
1. Call `POST /v1/user/{userID}/oauth-client/{oauth-clientID}/callback-url`. Include the OAuth callback URL of your application.
1. You are ready to initiate authorization requests.

![bunq_OAuth](https://static.bunq.com/assets/doc/20190313_OAuth_flows.jpg)

## <span id="topic-psd2-access-user-accounts-as-an-aisp">Access user accounts as an AISP</span>

As an AISP, you are allowed to authenticate in a user’s account with the following permissions:

* access account information (read):
	1. legal name
	2. IBAN
	3. nationality
	4. card validity data
	5. transaction history
	6. account balance

Once a bunq user has confirmed they want to connect their account via your application, you can initiate the authorization flow.
0. Open a session on the bunq server.
1. Initiate an authorization request. If your identity is validated, we send you a confirmation upon its creation. Pass the following parameters with the request:
	- *response_type*
	- *client_id* (here *response_type=code&client_id*)
	- *redirect_uri
	- *state
2. If the bunq user confirms their will to let your application connect to their account, we return you a Code. 
3. Exchange the *Code* for an *Access Token*. Make a `POST` call to `https://api.oauth.bunq.com/v1/token` passing the following parameters:
	- *code (at this stage, grant_type=authorization_code&code)*
	- *redirect_uri*
	- *client_id*
	- *client_secret*
4. We return the *Access Token*. Use it every time you interact with the bunq user’s account. You can use it to start a session to interact with the monetary accounts the user allows you to access.

![bunq_AISP](https://static.bunq.com/assets/doc/20190313_AISP_flow.jpg)

## <span id="topic-psd2-initiate-payments-as-a-pisp">Make payments as a PISP</span>

As a PISP, you are allowed to authenticate in a user’s account with the following permissions:
1. read account information 
	- legal name
	- IBAN
2. initiate payments (create draft payments)
3. confirm that the account balance is sufficient for covering the payment *(will be available in upcoming releases)*

Once a bunq user has confirmed they want to make a payment via your application, you can initiate the payment confirmation flow.

0.  Open a session to the bunq server.
1.   Get the id of the account you want to use to receive the money from the bunq users:
	- Call `GET monetary-account`. Check the ids of the accounts and save the id of the account you want to transfer customer money to.
2. Create a draft payment.
	- Call `POST draft-payment` and pass the following parameters:
		1. monetary-accountID
		2. userID
		3. the customer’s email address, phone number or IBAN in the *counterparty_alias*
3. If the user confirms their intent to make the payment, we carry out the transaction.
4. Check the status of the payment via `GET draft-payment` using the draft payment id parameter returned in the previous step.
![bunq_PISP](https://static.bunq.com/assets/doc/20190313_PISP_flow.jpg)


# <span id="topic-signing">Signing</span>
⚠️ **UPDATE:** We have deprecated the signing of the entire API request (the URL, headers and body). ***You now only need to sign the request body.*** Please switch to signing the body solely by April 28, 2020. Requests with full request signatures will stop being validated on that date.

We are legally required to protect our users and their data from malicious attacks and intrusions. That is why we beyond having a secure https connection, we use [asymmetric cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) for signing requests that create a session or payment. The use of signatures ensures the data is coming from the trusted party and was not modified after sending and before receiving.

Request body signing is only mandatory for the following operations: 
- open a session;
- create a payment;
- create a scheduled payment;
- any other operation that executes a payment such as the following:
	- accept a draft payment;
	- accept a scheduled payment;
	- accept a draft scheduled payment;
	- accept a payment request.

You will know that the API call must be encrypted if you get the 466 error code. 

The signing mechanism is implemented in our [SDKs](https://github.com/bunq) so if you are using them you don't have to worry about the details described below.

The signatures are created using the SHA256 cryptographic hash function and included (encoded in base 64) in the `X-Bunq-Client-Signature` request header and `X-Bunq-Server-Signature` response header. The data to sign is the following:

- For requests: the body only.
- For responses: 
1. the response code.
1. headers, sorted alphabetically by key, with key and value separated by `: ` (a colon followed by a space) and only including `Cache-Control`, `User-Agent` and headers starting with `X-Bunq-`. The headers should be separated from each other with a \n (linefeed) newline. For a full list of required call headers, see the headers page.
1. A `\n` (linefeed) newline separator.
1. The response body.

For signing requests, the client must use the private key corresponding to the public key that was sent to the server in the installation API call. That public key is what the server will use to verify the signature when it receives the request. In that same call the server will respond with a server side public key, which the client must use to verify the server's signatures. The generated RSA key pair must have key lengths of 2048 bits and adhere to the PKCS #8 standard.

## <span id="topic-signing-request-signing-example">Request signing example</span>

Consider the following request, a `POST` to `/v1/user/126/monetary-account/222/payment` (the JSON is formatted with newlines and indentations to make it more readable):

<table>
    <thead>
        <tr>
            <th>Header</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Cache-Control:</td>
            <td>no-cache</td>
        </tr>
        <tr>
            <td>User-Agent:</td>
            <td>bunq-TestServer/1.00 sandbox/0.17b3</td>
        </tr>
        <tr>
            <td>X-Bunq-Client-Authentication:</td>

<td>f15f1bbe1feba25efb00802fa127042b54101c8ec0a524c36464f5bb143d3b8b</td>
        </tr>
    </tbody>
</table>

```json
{
	"amount": {
		"value": "12.50",
		"currency": "EUR"
	},
	"counterparty_alias": {
		"type": "EMAIL",
		"value": "bravo@bunq.com"
	},
	"description": "Payment for drinks."
}
```

Let's sign that request. First create a variable `$dataToSign`, with the body of the request:

```json
{
    "amount": {
        "value": "12.50",
        "currency": "EUR"
    },
    "counterparty_alias": {
        "type": "EMAIL",
        "value": "bravo@bunq.com"
    },
    "description": "Payment for drinks."
}
```
Next, create the signature of `$dataToSign` using the SHA256 algorithm and the private key `$privateKey` of the Installation's key pair. In PHP, use the following to create a signature. The signature will be passed by reference into `$signature`.

`openssl_sign($dataToSign, $signature, $privateKey, OPENSSL_ALGO_SHA256);`

Encode the resulting `$signature` using base64, and add the resulting value to the request under the `X-Bunq-Client-Signature` header. You have just signed your request, and can send it!

## <span id="topic-signing-response-verifying-example">Response verifying example</span>

The response to the previous request is as follows (the JSON is formatted with newlines and indentations to make it more readable):

<table>
    <thead>
        <tr>
            <th>Header</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Access-Control-Allow-Origin:</td>
            <td>*</td>
        </tr>
        <tr>
            <td>Content-Type:</td>
            <td>application/json</td>
        </tr>
        <tr>
            <td>Date:</td>
            <td>Thu, 07 Apr 2016 08:32:04 GMT</td>
        </tr>
        <tr>
            <td>Server:</td>
            <td>APACHE</td>
        </tr>
        <tr>
            <td>Strict-Transport-Security:</td>
            <td>max-age=31536000</td>
        </tr>
        <tr>
            <td>Transfer-Encoding:</td>
            <td>chunked</td>
        </tr>
        <tr>
            <td>X-Bunq-Client-Response-Id:</td>
            <td>89dcaa5c-fa55-4068-9822-3f87985d2268</td>
        </tr>
        <tr>
            <td>X-Bunq-Client-Request-Id:</td>
            <td>57061b04b67ef</td>
        </tr>
        <tr>
            <td>X-Bunq-Server-Signature:</td>
            <td>ee9sDfzEhQ2L6Rquyh2XmJyNWdSBOBo6Z2eUYuM4bAOBCn9N5vjs6k6RROpagxXFXdGI9sT15tYCaLe5FS9aciIuJmrVW/SZCDWq/nOvSThi7+BwD9JFdG7zfR4afC8qfVABmjuMrtjaUFSrthyHS/5wEuDuax9qUZn6sVXcgZEq49hy4yHrV8257I4sSQIHRmgds4BXcGhPp266Z6pxjzAJbfyzt5JgJ8/suxgKvm/nYhnOfsgIIYCgcyh4DRrQltohiSon6x1ZsRIfQnCDlDDghaIxbryLfinT5Y4eU1eiCkFB4D69S4HbFXYyAxlqtX2W6Tvax6rIM2MMPNOh4Q==</td>
        </tr>
        <tr>
            <td>X-Frame-Options:</td>
            <td>SAMEORIGIN</td>
        </tr>
    </tbody>
</table>

```json
{
	"Response": [
		{
			"Id": {
				"id": 1561
			}
		}
	]
}
```
We need to verify that this response was sent by the bunq server and not from a man-in-the-middle:

We need to verify that this response was sent by the bunq server and not from a man-in-the-middle. 
- Create a `$dataToSign` variable starting with the response code (`200`). 
- On a new line follow that by a list of alphabetically-sorted headers only including headers starting with `X-Bunq-`. Convert to `X-Header-Capitalization-Style` from `x-header-non-capitalization-style` if needed.
- Add an extra (so double) linefeed after the list of headers. 
- End with the body of the request.

**⚠️ UPCOMING CHANGE:** We are deprecating full response signature and will start only signing the response body on April 28, 2020. 

So for our example above the response to sign will look like this:

```
200
X-Bunq-Client-Request-Id: 57061b04b67ef
X-Bunq-Server-Response-Id: 89dcaa5c-fa55-4068-9822-3f87985d2268

{"Response":[{"Id":{"id":1561}}]}
```
Now, verify the signature of `$dataToVerify` using the SHA256 algorithm and the public key `$publicKey` of the server. In PHP, use the following to verify the signature.

`openssl_sign($dataToVerify, $signature, $publicKey, OPENSSL_ALGO_SHA256);`

## <span id="topic-signing-troubleshooting">Troubleshooting</span>

If you get an error telling you "The request signature is invalid", please check the following:

- There are no redundant characters (extra spaces, trailing line breaks, etc.) in the data to sign.
- In your data to sign, you have used only the endpoint URL, for instance POST /v1/user, and not the full url, for instance `POST https://sandbox.public.api.bunq.com/v1/user`
- You only added the headers `Cache-Control`, `User-Agent` and headers starting with `X-Bunq-`.
- In your data to sign, you have sorted the headers alphabetically by key, ascending.
- There is a colon followed by a space `: ` separating the header key and value in your data to sign.
- There is an extra line break after the list of headers in the data to sign, regardless of whether there is a request body.
- Make sure the body is appended to the data to sign exactly as you're adding it to the request.
- In your data to sign, you have not added the `X-Bunq-Client-Signature` header to the list of headers (that would also be impossible).
- You have added the full body to the data to sign.
- You use the data to sign to create a SHA256 hash signature.
- You have base64 encoded the SHA256 hash signature before adding it to the request under `X-Bunq-Client-Signature`.

# <span id="topic-headers">Headers</span>

HTTP headers allow your client and bunq to pass on additional information along with the request or response.

While this is already implemented in our [SDKs](https://github.com/bunq), please follow these instructions to make sure you set appropriate headers for calls if using bunq API directly.

## <span id="topic-headers-request-headers">Request headers</span>

### <span id="topic-headers-request-headers-mandatory-request-headers">Mandatory request headers</span>

#### Cache-Control

`Cache-Control: no-cache`

The standard HTTP Cache-Control header is required for all requests.

#### User-Agent

`User-Agent: bunq-TestServer/1.00 sandbox/0.17b3`

The User-Agent header field should contain information about the user agent originating the request. There are no restrictions on the value of this header.

#### X-Bunq-Client-Signature

**⚠️ UPCOMING CHANGE:** Header and URL signature will stop being validated on April 28, 2020. Please [sign the request body](https://doc.bunq.com/#/signing) only.

`X-Bunq-Client-Signature: XLOwEdyjF1d+tT2w7a7Epv4Yj7w74KncvVfq9mDJVvFRlsUaMLR2q4ISgT+5mkwQsSygRRbooxBqydw7IkqpuJay9g8eOngsFyIxSgf2vXGAQatLm47tLoUFGSQsRiYoKiTKkgBwA+/3dIpbDWd+Z7LEYVbHaHRKkEY9TJ22PpDlVgLLVaf2KGRiZ+9/+0OUsiiF1Fkd9aukv0iWT6N2n1P0qxpjW0aw8mC1nBSJuuk5yKtDCyQpqNyDQSOpQ8V56LNWM4Px5l6SQMzT8r6zk5DvrMAB9DlcRdUDcp/U9cg9kACXIgfquef3s7R8uyOWfKLSNBQpdVIpzljwNKI1Q`


#### X-Bunq-Client-Authentication

`X-Bunq-Client-Authentication: 622749ac8b00c81719ad0c7d822d3552e8ff153e3447eabed1a6713993749440`

The authentication *token* is used to authenticate the source of the API call. It is required by all API calls except for `POST /v1/installation`. 

It is important to note that the device and session calls are using the token from the response of the installation call, while all the other calls use the token from the response of the session-server call:
- Pass the **installation *Token*** you get in the response to the `POST /installation` call in the `/device-server` and `/session-server` calls.
- Pass the **session *Token*** you get in the response to the `POST /session-server` call in all the other calls.

### <span id="topic-headers-request-headers-otpional-request-headers">Optional request headers</span>

#### X-Bunq-Language

`X-Bunq-Language: en_US`

`en_US` is the default language setting for responses and error descriptions.

The X-Bunq-Language header must contain a preferred language indication. The value of this header is formatted as a ISO 639-1 language code plus a ISO 3166-1 alpha-2 country code, separated by an underscore.

Currently only the languages en_US and nl_NL are supported. Anything else will default to en_US.

#### X-Bunq-Region

`X-Bunq-Region: en_US`

`en_US` is the default region for localization formatting.

The X-Bunq-Region header must contain the region (country) of the client device. The value of this header is formatted as a ISO 639-1 language code plus a ISO 3166-1 alpha-2 country code, separated by an underscore.

#### X-Bunq-Client-Request-Id

`X-Bunq-Client-Request-Id: a4f0de`

This header has to specify an ID with each request that is unique for the logged in user. There are no restrictions for the format of this ID. However, the server will respond with an error when the same ID is used again on the same DeviceServer.

#### X-Bunq-Geolocation

`X-Bunq-Geolocation: 4.89 53.2 12 100 NL`

`X-Bunq-Geolocation: 0 0 0 0 000` *(if no geolocation is available or known)*

This header has to specify the geolocation of the device. It makes it possible for bunq to map the geolocation with the payment.
‌
The format of this value is longitude latitude altitude radius country. The country is expected to be formatted of an ISO 3166-1 alpha-2 country code. When no geolocation is available or known the header must still be included but can be zero valued.

### <span id="topic-headers-request-headers-attachment-headers">Attachment headers</span>

#### Content-Type

`Content-Type: image/jpeg`

This header should be used when uploading an attachment to pass its MIME type. Supported types are: image/png, image/jpeg and image/gif.

#### X-Bunq-Attachment-Description
X-Bunq-Attachment-Description: Check out these cookies.
This header should be used when uploading an Attachment's content to give it a description.

## <span id="topic-response-headers">Response headers</span>

### <span id="topic-response-headers-all-responses">All Responses</span>

####  X-Bunq-Client-Request-Id

`X-Bunq-Client-Request-Id: a4f0de`

The same ID that was provided in the request's X-Bunq-Client-Request-Id header. Is included in the response (and request) signature, so can be used to ensure this is the response for the sent request.

#### X-Bunq-Client-Response-Id

`X-Bunq-Client-Response-Id: 76cc7772-4b23-420a-9586-8721dcdde174`

A unique ID for the response formatted as a UUID. Clients can use it to add extra protection against replay attacks.

#### X-Bunq-Server-Signature

`X-Bunq-Server-Signature: XBBwfDaOZJapvcBpAIBT1UOmczKqJXLSpX9ZWHsqXwrf1p+H+eON+TktYksAbmkSkI4gQghw1AUQSJh5i2c4+CTuKdZ4YuFT0suYG4sltiKnmtwODOFtu1IBGuE5XcfGEDDSFC+zqxypMi9gmTqjl1KI3WP2gnySRD6PBJCXfDxJnXwjRkk4kpG8Ng9nyxJiFG9vcHNrtRBj9ZXNdUAjxXZZFmtdhmJGDahGn2bIBWsCEudW3rBefycL1DlpJZw6yRLoDltxeBo7MjgROBpIeElh5qAz9vxUFLqIQC7EDONBGbSBjaXS0wWrq9s2MGuOi9kJxL2LQm/Olj2g==`

The server's signature for this response. See the signing page for details on how to verify this signature.

### <span id="topic-response-headers-warning-header">Warning header</span>

#### X-Bunq-Warning

`X-Bunq-Warning: "You have a negative balance. Please check the app for more details."`

Used to inform you on situations that might impact your bunq account and API access.

# <span id="topic-errors">Errors</span>

Familiar HTTP response codes are used to indicate the success or failure of an API request.

Generally speaking, codes in the 2xx range indicate success, while codes in the 4xx range indicate an error having to do with provided information (e.g. a required parameter was missing, insufficient funds, etc.).

Finally, codes in the 5xx range indicate an error with bunq servers. If this is the case, please stop by the support chat and report it to us.

## <span id="topic-errors-response-codes">Response codes</span>

<table>
    <thead>
        <tr>
            <th>Code</th>
            <th>Error</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>200</td>
            <td>OK</td>
            <td>Successful HTTP request</td>
        </tr>
        <tr>
            <td>399</td>
            <td>NOT MODIFIED</td>
            <td>Same as a 304, it implies you have a local cached copy of the data</td>
        </tr>
        <tr>
            <td>400</td>
            <td>BAD REQUEST</td>
            <td>Most likely a parameter is missing or invalid</td>
        </tr>
        <tr>
            <td>401</td>
            <td>UNAUTHORISED</td>
            <td>Token or signature provided is not valid</td>
        </tr>
        <tr>
            <td>403</td>
            <td>FORBIDDEN</td>
            <td>You're not allowed to make this call</td>
        </tr>
        <tr>
            <td>404</td>
            <td>NOT FOUND</td>
            <td>The object you're looking for cannot be found</td>
        </tr>
        <tr>
            <td>405</td>
            <td>METHOD NOT ALLOWED</td>
            <td>The method you are using is not allowed for this endpoint</td>
        </tr>
        <tr>
            <td>429</td>
            <td>RATE LIMIT</td>
            <td>Too many API calls have been made in a too short period</td>
        </tr>
        <tr>
            <td>466</td>
            <td>REQUEST SIGNATURE REQUIRED</td>
            <td>Request signature is required for this operation.</td>
        </tr>
        <tr>
            <td>490</td>
            <td>USER ERROR</td>
            <td>Most likely a parameter is missing or invalid</td>
        </tr>
        <tr>
            <td>491</td>
            <td>MAINTENANCE ERROR</td>
            <td>bunq is in maintenance mode</td>
        </tr>
        <tr>
            <td>500</td>
            <td>INTERNAL SERVER ERROR</td>
            <td>Something went wrong on bunq's end</td>
        </tr>
    </tbody>
</table>

All errors 4xx code errors will include a JSON body explaining what went wrong.

## <span id="topic-errors-rate-limits">Rate limits</span>

If you are receiving the error 429, please make sure you are sending requests at rates that are below our rate limits.

Our rate limits per IP address per endpoint:

- GET requests: 3 within any 3 consecutive seconds
- POST requests: 5 within any 3 consecutive seconds
- PUT requests: 2 within any 3 consecutive seconds
- Callbacks: 2 callback URLs per notification category

We have a lower rate limit for `/session-server`: 1 request within 30 consecutive seconds.

# <span id="topic-api-conventions">API conventions</span>

Make sure to follow these indications when using the bunq API or get started with our SDKs.

## <span id="topic-api-conventions-responses">Responses</span>

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

## <span id="topic-api-conventions-errors">Errors</span>

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

## <span id="topic-api-conventionsobject-type-indications">Object Type indications</span>

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

## <span id="topic-api-conventions-time-formats">Time formats</span>

Times and dates being sent to and from the API are in UTC. The format that should be used is `YYYY-MM-DD hh:mm:ss.ssssss`, where the letters have the meaning as specified in ISO 8601. For example: `2017-01-13 13:19:16.215235`.

# <span id="topic-callbacks">Callbacks</span>

Callbacks are used to send information about events on your bunq account to a URL of your choice, so that you can receive real-time updates.

## <span id="topic-callbacks-notification-filters">Notification Filters</span>

To receive notifications for certain activities on a bunq account, you have to create notification filters. It is possible to send the notifications to a provided URL and/or the user’s phone as push notifications.

Use the `notification-filter-push` resource to create and manage push notification filters. Provide the type of events you want to receive notifications about in the `category` field. 

```json    
{
   "notification_filters":[
      {
         "category":"SCHEDULE_RESULT"
      }
   ]
}
```

Use the `notification-filter-url` resource to create and manage URL notification filters. The callback URL you provide in the `notification_target` field must use HTTPS. 

```json
{
   "notification_filters":[
      {
         "category":"PAYMENT",
         "notification_target":"{YOUR_CALLBACK_URL}"
      }
   ]
}
```

### <span id="topic-callbacks-notification-filters-callback-categories">Callback categories</span>

<table>
    <thead>
        <tr>
            <th>Category</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>BILLING</td>
            <td>notifications for all bunq invoices</td>
        </tr>
        <tr>
            <td>CARD_TRANSACTION_SUCCESSFUL</td>
            <td>notifications for successful card transactions</td>
        </tr>
        <tr>
            <td>CARD_TRANSACTION_FAILED</td>
            <td>notifications for failed card transaction</td>
        </tr>
        <tr>
            <td>CHAT</td>
            <td>notifications for received chat messages</td>
        </tr>
        <tr>
            <td>DRAFT_PAYMENT</td>
            <td>notifications for creation and updates of draft payments</td>
        </tr>
        <tr>
            <td>IDEAL</td>
            <td>notifications for iDEAL-deposits towards a bunq account</td>
        </tr>
        <tr>
            <td>SOFORT</td>
            <td>notifications for SOFORT-deposits towards a bunq account</td>
        </tr>
        <tr>
            <td>MUTATION</td>
            <td>notifications for any action that affects a monetary account’s balance</td>
        </tr>
        <tr>
            <td>PAYMENT</td>
            <td>notifications for payments created from, or received on a bunq account (doesn’t include payments that result out of paying a Request, iDEAL, Sofort or Invoice). Outgoing payments have a negative value while incoming payments have a positive value</td>
        </tr>
        <tr>
            <td>REQUEST</td>
            <td>notifications for incoming requests and updates on outgoing requests</td>
        </tr>
        <tr>
            <td>SCHEDULE_RESULT</td>
            <td>notifications for when a scheduled payment is executed</td>
        </tr>
        <tr>
            <td>SCHEDULE_STATUS</td>
            <td>notifications about the status of a scheduled payment, e.g. when the scheduled payment is updated or cancelled</td>
        </tr>
        <tr>
            <td>SHARE</td>
            <td>notifications for any updates or creation of Connects (ShareInviteBankInquiry)</td>
        </tr>
        <tr>
            <td>TAB_RESULT</td>
            <td>notifications for updates on Tab payments</td>
        </tr>
        <tr>
            <td>BUNQME_TAB</td>
            <td>notifications for updates on bunq.me Tab (open request) payments</td>
        </tr>
        <tr>
            <td>SUPPORT</td>
            <td>notifications for messages received from us through support chat</td>
        </tr>
    </tbody>
</table>

### <span id="topic-callbacks-notification-filters-mutation-category">Mutation category</span>

A Mutation is a change in the balance of a monetary account. So, for each payment-like object, such as a request, iDEAL-payment or a regular payment, a Mutation is created. Therefore, the `MUTATION` category can be used to keep track of a monetary account's balance.

### <span id="topic-callbacks-notification-filters-receiving-callbacks">Receiving callbacks</span>

Callbacks for the sandbox environment will be made from different IP's at AWS.  
Callbacks for the production environment will be made from `185.40.108.0/22`.

*The IP addresses might change*. We will notify you in a timely fashion if such a change would take place.

### <span id="topic-callbacks-notification-filters-retry-mechanism">Retry mechanism</span>

When the execution of a callback fails (e.g. if the callback server is down or the response contains an error) it is tried again for a maximum of 5 times, with an interval of one minute between each try. If your server is not reachable by the callback after the 6th total try, the callback is not sent anymore.

### <span id="topic-callbacks-notification-filters-removing-callbacks">Removing callbacks</span>

To remove callbacks for an object, send a PUT request to the *user-person*, *user-company*, *monetary-account* or *cash-register* resource with the `notification_filters` field of the JSON request body unset.
```
{
    "notification_filters": []
}
```

## <span id="topic-callbacks-certificate-pinning">Certificate pinning</span>

We recommend you use certificate pinning as an extra security measure. With certificate pinning, we check the certificate of the server on which you want to receive callbacks against the pinned certificate that has been provided by you and cancel the callback if that check fails.

### <span id="topic-callbacks-certificate-pinning-how-to-set-up-certificate-pinning">How to set up certificate pinning</span>

Retrieve the SSL certificate of your server using the following command:

1. `openssl s_client -servername www.example.com -connect www.example.com:443 < /dev/null | sed -n "/-----BEGIN/,/-----END/p" > www.example.com.pem`
2. `POST` the certificate to the certificate-pinned endpoint.

Now every callback that is made will be checked against the pinned certificate that you provided. Note that if the SSL certificate on your server expires or is changed, our callbacks will fail.

# <span id="topic-pagination">Pagination</span>

In order to control the size of the response of a `LIST` request, items can be paginated. A `LIST` request is a request for every one of a certain resources, for instance all payments of a certain monetary account `GET /v1/user/1/monetary-account/1/payment`). You can decide on the maximum amount of items of a response by adding a `count` query parameter with the number of items you want per page to the URL. For instance:

`GET /v1/user/1/monetary-account/1/payment?count=25`

When no `count` is given, the default count is set to 10. The maximum `count` you can set is 200.

With every listing, a `Pagination` object will be added to the response, containing the URLs to be used to get the next or previous set of items. The URLs in the Pagination object can be used to navigate through the listed resources. The Pagination object looks like this given a count of 25:

```json
{
    "Pagination": {
        "future_url": null,
        "newer_url": "/v1/user/1/monetary-account/1/payment?count=25&newer_id=249",
        "older_url": "/v1/user/1/monetary-account/1/payment?count=25&older_id=224"
    }
}
```

The `newer_url` value can be used to get the next page. The `newer_id` is always the ID of the last item in the current page. If `newer_url` is `null`, there are no more recent items before the current page.

The `older_url` value can be used to get the previous page. The `older_id` is always the ID of the first item in the current page. If `older_url` is `null`, there are no older items after the current page.

The `future_url` can be used to refresh and check for newer items that didn't exist when the listing was requested. The `newer_id` will always be the ID of the last item in the current page. `future_url` will be `null` if `newer_id` is not also the ID of the latest item.

# <span id="topic-moving-to-production">Moving to Production</span>

Have you tested your bunq integration to the fullest and are you now ready to introduce it to the world? Then the time has come to move it to a production environment!

To get started you'll need some fresh API keys for the production environment, which you can create via your bunq app. You can create these under "Profile" by tapping the "Security" menu. We do, however, highly recommend using a standard API Key instead of a Wildcard API Key. The former is significantly safer and it protects you from intrusions and possible attacks.

There's only a few things to do before your beautiful bunq creation can be moved to production. You're going to have to change your API Key and redo the sequence of calls to open a session.

The bunq Public API production environment is hosted at `https://api.bunq.com`.

Do you have any questions or remarks about the process, or do you simply want to show off with your awesome creations? Don't hesitate to drop us a line on [together.bunq.com](https://together.bunq.com).

Please be aware that if you will gain access to account information of other bunq users or initiate a payment for them, you  require a PSD2 permit.

# <span id="topic-android-emulator">Android Emulator</span>

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

- The first time you open the app you will be asked to verify your phone number. Sandbox however does not send actual SMS messages. Enter any valid phone number and use the default verification code `992266`. This will work for all numbers.
- Get [tinker](https://bunq.com/api/) for the language of your choice.
- Once installed, run `tinker/user-overview`, this will create an account for you when necessary.
- The output of the command above will show you the login credentials for your sandbox account.
- It is **not** possible to create accounts using the regular signup in the app, bunq is not reviewing Sandbox applications.

Create a new API key

To create additional API keys for the sandbox environment, log in to the sandbox app for Android as either a UserPerson or UserCompany. Navigate to Profile > Security > API keys and click the '+' button. Please be aware that the API key can only be assigned to an IP within 4 hours after its creation. After the 4 hours, it will become invalid if not assigned. API keys that are created via the sandbox app are wiped with each sandbox reset.

# <span id="topic-quickstart-opening-a-session">Quickstart: Opening a Session</span>

## <span id="topic-quickstart-opening-a-session-goal">Goal</span>

So, you want to start using the bunq API, awesome! To do this, you have to open a session in which you will be making those calls.

## <span id="topic-quickstart-opening-a-session-getting-an-api-key">Getting an API key</span>

To connect to the API, you have to make sure you have received an API key. 

For the production environment, you can generate your own keys in the bunq app (under 'Profile' -> 'Security'). 

For the sandbox environment you can get an API key from tinker and android emulator as [described above](#android-emulator). 

Alternative you can do a curl request: `curl https://public-api.sandbox.bunq.com/v1/sandbox-user -X POST --header "Content-Type: application/json" --header "Cache-Control: none" --header "User-Agent: curl-request" --header "X-Bunq-Client-Request-Id: $(date)randomId" --header "X-Bunq-Language: nl_NL" --header "X-Bunq-Region: nl_NL" --header "X-Bunq-Geolocation: 0 0 0 0 000"`. That'll create a sample user and return an associated API key for you.

Note that production API key is only usable on production and sandbox key is only usable on sandbox. Sandbox key has a `sandbox_` prefix while production key does not have any noticeable prefixes.

## <span id="topic-quickstart-opening-a-session-call-sequence">Call sequence</span>

The calls you need to perform to set up a session from scratch are the following:

### <span id="topic-quickstart-opening-a-session-call-sequence-post-installation">1. POST installation</span>

Each call needs to be signed with your own private key. An Installation is used to tell the server about the public key of your key pair. The server uses this key to verify your subsequent calls.

Start by generating a 2048-bit RSA key pair. You can find examples by looking at the source code of the sdk's located at github.

#### Headers

On the headers page you can find out about the mandatory headers. Take care that if you are in the sandbox environment, you set an `Authorization` header. Specific to the `POST /installation` call, you shouldn't use the `X-Bunq-Client-Authentication` or the `X-Bunq-Client-Signature` headers.

#### Body

Post your public key to the Installation endpoint (use `\n` for newlines in your public key).

#### Response

Save the Installation token and the bunq API's public key from the response. This token is used in the `Authentication` header to register a `DeviceServer` and to start a `SessionServer`. The bunq API's public key should be used to verify future responses received from the bunq API.

### <span id="topic-quickstart-opening-a-session-call-sequence-post-device-server">2. POST device-server</span>

Further calls made to the server need to come from a registered device. `POST /device-server` registers your current device and the IP address(es) it uses to connect to the bunq API.

#### Headers

Use the token you received from `POST /installation` in the `X-Bunq-Client-Authentication` header. Make sure you sign your call, passing the call signature in `X-Bunq-Client-Signature` header.

#### Body

For the secret, use the API key you received. If you want to create another API key, you can do so in the bunq sandbox app (or production app for the production environment). Login, go to Profile > Security and tap 'API keys'. The freshly created API key can be assigned to one or multiple IP addresses using `POST device-server` within 4 hours before becoming invalid. As soon as you start using your API key, it will remain valid until the next sandbox reset.   For the secret, use the API key you received.

### <span id="topic-quickstart-opening-a-session-call-sequence-post-session-server">3. POST session-server</span>

To make any calls besides `installation` and `device-server`, you need to open a session.

#### Headers

Use the token you received from `POST /installation` in the `X-Bunq-Client-Authentication` header. Make sure you sign your call, passing the call signature in `X-Bunq-Client-Signature` header.

#### Body

For the secret, use the API key you received.

#### Response

The token received in the response to `POST /session-server` should be used to authenticate your calls in this session. Pass this session's token in the `X-Bunq-Client-Authentication` header on every call you make in this session.

# <span id="topic-quickstart-payment-request">Quickstart: Payment Request</span>

## <span id="topic-quickstart-payment-request-goal">Goal</span>

You want to offer bunq payments on a website or in an application.

## <span id="topic-quickstart-payment-request-scenario">Scenario</span>

In this use case the consumer and the merchant both have a bunq account. The consumer wants to pay with bunq and enters their alias in the bunq payment field at checkout. The merchant sends the request for payment to the consumer when the consumer presses enter. The consumer agrees to the request in the bunq mobile app and the merchant has immediate confirmation of the payment. Please be aware that if you will gain access to account information of other bunq users or initiate a payment for them, you require a PSD2 permit.

## <span id="topic-quickstart-payment-request-before-you-start">Before you start</span>

Make sure that you have opened a session and that for any call you make after that, you pass the session’s token in the X-Bunq-Client-Authentication header.

## <span id="topic-quickstart-payment-request-call-sequence">Call Sequence</span>

The consumer is at checkout and selects the bunq payment method. This would be a logical time to open a session on the bunq server.

### <span id="topic-quickstart-payment-request-call-sequence-list-monetary-account">1. LIST monetary-account</span>

When a request for payment is accepted, the money will be deposited on the bank account the request for payment is connected to. Let’s start by finding all your available bank accounts. Pick one of them to make the request for payment with and save its `id`.

### <span id="topic-quickstart-payment-request-call-sequence-post-monetary-account-attachment">2. POST monetary-account attachment (optional)</span>

Optionally, you can attach an image to the request for payment.

#### Headers
Make sure you set the `Content-Type` header to match the MIME type of the image. It’s also required you pass a description of the image via the `X-Bunq-Attachment-Description` header.

#### Body
The payload of this request is the binary representation of the image file. Do not use any JSON formatting.

#### Response
Save the `id` of the posted attachment. You’ll need it to attach it to the request for payment.

### <span id="topic-quickstart-payment-request-call-sequence-post-request-inquiry">3. POST request-inquiry</span>

Next, create a request inquiry. A request inquiry is the request for payment that your customer can respond to by accepting or rejecting it.

#### Body

Pass the customer’s email address, phone number or IBAN in the `counterparty_alias`. Make sure you set the correct `type` for the alias, depending on what you pass. When providing an IBAN, a name of the `counterparty_alias` is required. You can provide the `id` of the created attachment.

#### Response

You will receive the `id` of the created request inquiry in the response. Save this `id`. You will need it to check if the customer has responded to the request yet.

### <span id="topic-quickstart-payment-request-call-sequence-get-request-inquiry">4. GET request-inquiry</span>

After you’ve sent the request for payment, its status can be checked.

#### Response

When the `status` is `ACCEPTED`, the customer has accepted and paid the request, and you will have received the money on the connected monetary account. If the `status` is `REJECTED`, the customer did not accept the request.

# <span id="topic-quickstart-create-a-tab-payment">Quickstart: Create a Tab payment</span>

## <span id="topic-quickstart-create-a-tab-payment-goal">Goal</span>

You will create a tab that can be paid once by a single user, a so called TagUsageSingle, and explore three different ways to make the Tab visible to your customers:

- QR code from the CashRegister
- QR code from the Tab.

## <span id="topic-quickstart-create-a-tab-payment-before-you-start">Before you start</span>

Make sure that you have opened a session and that for any call you make after that, you pass the session’s token in the `X-Bunq-Client-Authentication` header.

## <span id="topic-quickstart-create-a-tab-payment-call-sequence">Call sequence</span>

### <span id="topic-quickstart-create-a-tab-payment-call-sequence-post-attachment-public">1. POST attachment-public</span>

Start by creating an attachment that will be used for the avatar for the cash register.

#### Header

Make sure you set the `Content-Type` header to match the MIME type of the image. It is also required you pass a description of the image via the `X-Bunq-Attachment-Description` header.

#### Body

The payload of this request is the binary representation of the image file. Do not use any JSON formatting.

#### Response

Save the `uuid` of the posted attachment. You'll need it to create the avatar in the next step.

### <span id="topic-quickstart-create-a-tab-payment-call-sequence-post-avatar">2. POST avatar</span>

Make an avatar using the public attachment you've just created.

#### Body

The payload of this request is the `uuid` of the attachment public.

#### Response

In response, you’ll receive the UUID of the avatar created using the attachment. Save this UUID. You’ll use it as the avatar for the cash register you're about to create.

### <span id="topic-quickstart-create-a-tab-payment-call-sequence-list-monetary-account">3. LIST monetary-account</span>

Get a listing of all available monetary accounts. Choose one, and save the id of the monetary account you want your cash register to be connected to. Each paid tab for the cash register will transfer the money to this account.

### <span id="topic-quickstart-create-a-tab-payment-call-sequence-post-cash-register">4a. POST cash-register</span>

Create a cash register. Use the `id` of the monetary account you want to connect the cash register to in the URL of the request.

#### Body

In the body provide the `uuid` of the avatar you created for this cash register. Also make sure to provide a unique name for your cash register. Set the status to `PENDING_APPROVAL`.

#### Response

The response contains the `id` of the cash register you created. Save this `id`. You will need it to create subsequent tabs and tab items.

### <span id="topic-quickstart-create-a-tab-payment-call-sequence-wait-for-approval">4b. Wait for approval</span>

On the production environment, a bunq admin will review and approve your cash register. In the sandbox environment, your cash register will be automatically approved.

### <span id="topic-quickstart-create-a-tab-payment-call-sequence-post-tab-usage-single">5. POST tab-usage-single</span>

Create a new tab that is connected to your cash register. Use the id of the cash register you want to connect this tab to in the URL of your request.

#### Body

Give the tab a name in `merchant_reference`. Create the tab with status `OPEN`, and give the tab a starting amount. You can update this amount later.

#### Response

The response contains the uuid of the tab you created.

### <span id="topic-quickstart-create-a-tab-payment-call-sequence-post-tab-item">6. POST tab-item (optional)</span>

You can add items to a tab. For instance, if a customer will be paying for multiple products via this tab, you can decide to add an item for each of these. Adding items to a tab is optional, and adding them will not change the total amount of the tab itself. However, if you've added any tab items the sum of the amounts of these items must be equal to the `total_amount` of the tab when you change its status to `WAITING_FOR_PAYMENT`.

### <span id="topic-quickstart-create-a-tab-payment-call-sequence-put-tab-usage-single">7. PUT tab-usage-single</span>

Update the status of the tab to `WAITING_FOR_PAYMENT` if you want the costumer to pay the tab, and you're done adding any tab items. You can use this request to make the tab visible for your costumers.

#### Visibility

To decide how you are going to make your tab visible, pass a visibility object in the payload.

Setting `cash_register_qr_code` to true will connect this tab to the QR code from the cash register. If this cash register does not have a QR code yet, one will be created. Only one Tab can be connected to the cash register’s QR code at any given time.

Setting `tab_qr_code` to true will create a QR code specifically for this tab. This QR code can not be linked to anything else.

# <span id="topic-quickstart-transwerwise-payment">Quickstart: Create a TransferWise payment</span>

## Goal

You want to send a payment in currency other than euro outside the SEPA zone.

## Before you start

Make sure that you have opened a session and that for any call you make after that, you pass the session’s token in the `X-Bunq-Client-Authentication` header.

ℹ️ *bunq relies on TransferWise for international, so you need to create a TransferWise account linked to a bunq account to be able to create international transfers. You can do it either from the bunq app or using our API as described below.*

## Get the up-to-date exchange rate (optional)

You might want to check the latest currency exchange rate before making a transfer. Here’s how you can do it using the bunq API:
1. Check the list of supported currencies via `GET /user/{userID}/transferwise-currency`. Copy the needed currency code.
2. Create a temporary quote for the currency of your choice via `POST /user/{userID}/transferwise-quote-temporary`.

ℹ️ *A quote is the exchange rate at the exact timestamp. Temporary quotes carry solely informative value and cannot be used for creating a transfer.*

3. Read the temporary quote via `GET /user/{userID}/transferwise-quote-temporary/{transferwise-quote-temporaryID}`.

## Create a TransferWise account

You need a TransferWise account linked to your bunq account to make TransferWise payments via the bunq API. Create one via `POST /user/{userID}/transferwise-user`, and save its ID. 

ℹ️ *You cannot use an existing TransferWise account.*

## Create a quote

1. Create a quote via POST /user/{userID}/transferwise-quote and save its ID. 

ℹ️ *Use amount_target to indicate the sum the recipient must get. Amount_source, on the other hand, will indicate the sum you want to send, but it will not necessarily be the final sum the recipient gets.*

ℹ️ *Quotes are valid for 30 minutes so if you do not manage to create a transfer within this time, you will need to create another quote.*

2. Get the exchange rate by reading the quote via GET /user/{userID}/transferwise-quote/(transferwise-quoteID).

## Create a recipient

If you have sent money via the TransferWise account linked to your bunq account, you can reuse the recipients. You can list their IDs via `GET /user/{userID}/transferwise-quote/{transferwise-quoteID}/transferwise-recipient`.

To create a new, previously unused recipient, follow these steps:
1. Retrieve the fields required for creating the recipient as the requirements vary for the type of recipient in each country. Iterate sending the following request pair till there are no more required fields:
- `GET /user/{userID}/transferwise-quote/{transferwise-quoteID}/transferwise-recipient-requirement`
- `POST /user/{userID}/transferwise-quote/{transferwise-quoteID}/transferwise-recipient-requirement`
2. Create a recipient account using the final request body from the previous step with `POST /user/{userID}/transferwise-quote/{transferwise-quoteID}/transferwise-recipient-requirement`

## Create a transfer

Finally, having both the quote ID and the recipient ID, you can create a transfer. 🎉

1. Check if there are any additional transfer requirements via `POST /user/{userID}/transferwise-quote/{transferwise-quoteID}/transferwise-transfer-requirement`.
2. Create a transfer via `POST /user/{userID}/transferwise-quote/{transferwise-quoteID}/transferwise-transfer`. You need to specify the ID of the monetary account from which you want the payment to be made.

# <span id="topic-quickstart-attachments">Quickstart: Downloading attachments</span>

## Goal
Export receipts and invoices attached to payments to your application.

## The scenario you want to achieve
0. The bunq user has accepted the authorization request and your application can read the bunq user’s account information.
1. Your application imports all the transactions and attachments.
2. The bunq user sees the transactions matched with the receipts and invoices in your application.

## Before you start
* Make sure that you have opened a session
* Make sure you pass the session Token in the X-Bunq-Client-Authentication header in all the following requests of the session.

## Call sequence
1. List the payments of the user via GET /user/{userID}/monetary-account/{monetary-accountID}/payment.
2. Check if the payments have attachments via GET /user/{userID}/monetary-account/{monetary-accountID}/payment/{paymentID}/note-attachment. Save the attachment IDs.
3. Export the raw content of the attachments via GET /user/{userID}/attachment/{attachmentID}/content.

***HINT:** You can use [callbacks](https://doc.bunq.com/#/callbacks) to make sure you don’t miss anything happening on the bunq account.*
