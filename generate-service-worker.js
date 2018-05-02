var swPrecache = require("sw-precache");
var rootDir = "docs";

swPrecache.write(rootDir + "/service-worker.js", {
    /**
         * Cache the index file statically
         * Re-run this script to update the file hash and trigger an update for all clients
         */
    staticFileGlobs: [rootDir + "/index.html"],
    // remove "docs" from the static file path
    stripPrefix: rootDir,
    // runtimeCaching which matches patterns and applices the specific handlers
    runtimeCaching: [
        {
            urlPattern: /swagger\.json$/,
            /**
                 * Return cached version first when possible but always attempt to update in the background
                 * @see https://github.com/GoogleChromeLabs/sw-toolbox/blob/master/docs/api.md#toolboxfastest
                 */
            handler: "fastest"
        },
        {
            // cache all js/css/image/font files but update in background
            urlPattern: /[.]?(html|js|css|json|png|jpg|svg|gif|jpeg|woff|woff2|ttf|eot)/,
            handler: "fastest"
        },
        {
            urlPattern: /https:\/\/fonts\.googleapis\.com\/.*/,
            handler: "cacheFirst"
        }
    ]
});
