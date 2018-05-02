# Service worker

## Behavior
The current service worker will statically cache the `docs/index.html` file and calculate a hash value for the contents. When the index file has been modified a new hash value should be created by running the generation script to let the browser know that a new version is available. 

```js
staticFileGlobs: [rootDir + "/index.html"],
```

For all other requests matching the pattern the [fastest](https://github.com/GoogleChromeLabs/sw-toolbox/blob/master/docs/api.md#toolboxfastest) handler is used which will serve a cache version first when possible. While it returns the cached version it will still attempt to do a network request. When this network request succeeds it will automatically update the cached data so on the next page load the new version is served from cache.

```js
{
    urlPattern: /swagger\.json$/,
    handler: "fastest"
},
{
    urlPattern: /[.]?(html|js|css|json|png|jpg|svg|gif|jpeg|woff|woff2|ttf|eot)/,
    handler: "fastest"
},
```

Alternatively the `networkFirst` strategy could be used. That will mean there won't be any noticable performance improvements while still allowing the documentation to be used offline since it will fall-back to a cached version if the network request fails.

## Generation
Generating/updating the service worker file is done by running the `generate-service-worker.js` file using node with no extra arguments.

```bash
node generate-service-worker.js
```