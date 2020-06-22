# Intro to the bunq API

Hi! Thanks for checking out our API! It’s an incredibly powerful tool for you to automate your banking any way you like! We offer over 200 operations you can make use of.

Because our API is so powerful, it can be overwhelming when you work with it for the first time. This article is meant to help you understand how bunq works so you can easily find the right endpoints and build your integration as fast as possible.

Let’s start by looking into the objects you can work with using the bunq API and the relations between them.
## Fundamental bunq API objects
No matter what integration you want to build, you will need to work with the core objects that are essential to the bunq user experience. While the concept of each is easy to understand, you’ll see that some names and relations are not what you would expect, which is because the Public bunq API is a part of our internal API, which serves the bunq app. 

Without further ado, here are the objects you’ll need to know by ID:
- `User`
- `MonetaryAccount`
- `Payment`
- `RequestInquiry`
- `Card`
- `Attachment`
- `NoteAttachment`

Let’s dive into the peculiarities of each of them.
### `User`
As a bank, we believe in user-centred design, and so we organized everything, including our app, service, and backend, around `User`s. You’ll notice that and every endpoint path starts with it. We support 3 user types, which have separate endpoints, permissions and properties:
- `userPerson` is accessible at `/user-person`;
- `userCompany` is accessible at `/user-company`;
- `userPaymentServiceProvider` is readable at `/user-payment-service-provider`.

`User` operates as a generalization object over all the possible user types. 

`userPerson` and `userCompany` represent bunq users with [subscriptions](https://www.bunq.com/benefits). As a bunq user, you will find yourself one of them. Getting your `userId` (`GET /user`) will be one of the first things you will do after you open your first session, as you need it to retrieve information from and perform operations with the user account.

Users with bunq subscriptions have access to the core banking services. They can create bank accounts (we call them monetary accounts), order cards, and make payments. All of them have subtypes and work with one another, which you will learn about in the following sections.

A `userPaymentServiceProvider` is created when a PSD2-certified company registers their [eIDAS certificate](https://medium.com/bunq-developers-corner/how-to-use-eidas-certificates-with-bunq-8067fbfffbf4) to bunq. In return, if the certificate is validated, they receive an API key. These bunq users do not have access to the bunq app and can only operate on behalf of other bunq users within the scope of their PSD2 role - AISP, PISP, and/or CBPII. 

### `MonetaryAccount`

The second object you will use the most is `MonetaryAccount`. Monetary accounts are holders of money you may know as bank accounts, sub-accounts, or pots. Unlike wallets, which work directly with cards, monetary accounts are linked to a legal bank account owner. 

You might have correctly guessed that Travel users (`UserPerson`s with the Travel subscription) do not own a *bank* account and so the monetary account they use with a card serves as a wallet.

Most operations including payments work with monetary accounts so you will need to specify `monetary-accountId` for the majority of your API calls. You can find the ID of the monetary accounts as well as identify the one you want to use by listing all the monetary accounts of the user (`GET /user/userId/monetary-account`).

bunq offers 3 types of monetary accounts, which, just like `user`s, have dedicated endpoints that serve as filters for your convenience:
- Classic single bank accounts or `MonetaryAccountBank`s are accessible at `/user/userId/monetary-account-bank`;
- (Auto-)savings accounts or `MonetaryAccountSavings`s are accessible at `/user/userId/monetary-account-savings`;
- Accounts shared with other bunq users (these users become fellow legal owners of the monetary account) or `MonetaryAccountJoint`s are accessible at `/user/userId/monetary-account-joint`.

VAT accounts fall under `MonetaryAccountSavings`s.

### `Payment`

Because the money is stored in monetary accounts, all transactions derive from or target them. `Payment` covers both incoming and outgoing payments so if you list the payments of the user, you will get all of them. 

While it’s impossible to *control* incoming payments, you can do so with the outgoing ones. Using the bunq API, you can create single, batch, draft and scheduled payments. All of them operate under the parent `Payment` object while having dedicated objects and endpoints:
- single payments or `Payment` are accessible at `/user/{userID}/monetary-account/{monetary-accountID}/payment`;
- an array of payments to be sent at once or `PaymentBatch`s are accessible at `/user/{userID}/monetary-account/{monetary-accountID}/payment-batch`;
- initiated payments that the user needs to accept or `DraftPayment`s are accessible at `/user/{userID}/monetary-account/{monetary-accountID}/draft-payment`;
- scheduled payments or `SchedulePayment`s are accessible at `/user/{userID}/monetary-account/{monetary-accountID}/schedule-payment`;

An array of scheduled payments or `SchedulePaymentBatch`s are accessible at `/user/{userID}/monetary-account/{monetary-accountID}/schedule-payment-batch`.

Draft scheduled payments or initiated recurring payments fall under `DraftPayment`. Moving the money between monetary accounts can be covered by any depending on what UX you want to achieve.

Aside from the sum to be sent, all payments require a receiver, which we call `counterparty_alias`. You can specify the addressee using the following pointer types:  `EMAIL`, `PHONE_NUMBER`, or `IBAN`. 

For worldwide and multi-currency payments, use our TransferWise endpoints. Follow [this tutorial](https://beta.doc.bunq.com/quickstart/transferwise-payment) for the details.

### `RequestInquiry`

With bunq, you can request payments from anyone - you just need to know their IBAN, email, or phone number. Non-bunq users will receive an email or an SMS leading to an interface where they can make the transaction from their bank account. 

`RequestInquiry` is the magical object that makes the above possible. Just like payments, it links to a monetary account of a user, which you can see in the endpoint you can use to create and access `RequestInquiry`s: `/user/{userID}/monetary-account/{monetary-accountID}/request-inquiry`. 

### `Card`
Just as cards belong to a bunq user, so is `Card` directly linked to `User`. Money needs to run into and out of monetary accounts so every card a bunq user possesses needs to be linked to one. There is no limit for how many cards can take money from a monetary account but a card can only have one primary monetary account. If the primary monetary account lacks sufficient funds, bunq checks the secondary monetary account. Else, the transaction fails.

Together with their PINs, cards ensure the 2-factor authentication of the user when the user makes a card payment. Such payments end up as `Payment`s and so will be returned when listing the payments of the user (`GET `/user/{userID}/monetary-account/{monetary-accountID}/payment``). If you want to list card transactions, you need to address `MasterCardAction` via `GET
/user/{userID}/monetary-account/{monetary-accountID}/mastercard-action`.

There are 2 kinds of cards bunq users can order: 
- `CardDebit` at `/user/{userID}/card-debit`, and 
- `CardCredit` at `/user/{userID}/card-credit`.

`CardDebit`supports Maestro, MasterCard, Tap & Pay, and virtual cards. `CardCredit`, on the other hand, offers MasterCards of either `MASTERCARD_TRAVEL` or `MASTERCARD_GREEN` product types. All cards of the users are listable under `Card`.

### `Attachment` and `NoteAttachment`

Both `Payment` and `RequestInquiry` objects can have a link to `Attachment`s - images in the .png, or .jpeg, format. This makes it possible for bunq users to send payments and payment requests with contextual photos by specifying the `attachmentid` and upload photos of invoices and receipts to existing transactions by creating `NoteAttachment`s.

The difference between the `Attachment` and `Note-attachment` objects lies in their relation to other objects. `Attachment` is directly linked to the monetary account and thus is a higher-level resource that can be referred to underlying objects-to-be-created, while `NoteAttachment` is connected to the existing objects that belong to the monetary account. You can observe this relation in the following endpoints:
- `/user/{userID}/monetary-account/{monetary-accountID}/attachment`
- `/user/{userID}/monetary-account/{monetary-accountID}/request-inquiry/{request-inquiryID}/note-attachment`
- `/user/{userID}/monetary-account/{monetary-accountID}/payment/{paymentID}/note-attachment`
- `/user/{userID}/monetary-account/{monetary-accountID}/draft-payment/{draft-paymentID}/note-attachment`
- `/user/{userID}/monetary-account/{monetary-accountID}/schedule-payment/{schedule-paymentID}/note-attachment`

![bunq_API_generalized](https://www.bunq.com/assets/media/developer/bunq-API-generalized.jpg)

## Security setup
As a bank, bunq puts tremendous effort into user data security. That is why you need to do a setup we call “creating an API context” before you can send your first custom API request. API context assures us the sender of the request is you, you are who you say you are, and, if you are a PSD2-certified party, what you are allowed to do.

API context creation flow was designed to exchange the crucial information to form [signatures](https://beta.doc.bunq.com/basics/authentication/signing) that will let you and bunq verify each other’s calls.

Our SDKs handle the API context creation flow for you so you’ll only need to provide us with some constants such as your API key and - only if you are a PSD2-certified party - certificate, certificate chain and the private key belonging to the QSEAL certificate.

OAuth is the obligatory authentication method for public projects whereas using API keys is allowed as long as only you have access to your application.

## 🌈 You’ve mastered the basics
Now you know how bunq works and can move on to building your own app! Jump to one of the below:
- [PHP SDK](https://github.com/bunq/sdk_php)
- [Python SDK](https://github.com/bunq/sdk_python)
- [Java SDK](https://github.com/bunq/sdk_java)
- [C# SDK](https://github.com/bunq/sdk_csharp)
- [API documentation](https://doc.bunq.com/)
