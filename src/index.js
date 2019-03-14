// @flow
import SwaggerUIStandalonePreset from "swagger-ui";
import "../node_modules/cookieconsent/build/cookieconsent.min.js";
import dotenv from "dotenv";

import initializeCookieConsentBar from "./helpers/tracking";
import registerServiceWorker from "./helpers/registerServiceWorker";

import "swagger-ui/dist/swagger-ui.css";

import {
    BunqLayoutPlugin,
    DisableTryItOutPlugin
} from "./plugins";
import "./scss/index.css";

dotenv.config();

SwaggerUIStandalonePreset({
    url: "https://raw.githubusercontent.com/bunq/doc/master/swagger.json",
    dom_id: "#root",
    deepLinking: true,
    layout: "BunqLayout",
    plugins: [
        BunqLayoutPlugin,
        DisableTryItOutPlugin
    ]
});

initializeCookieConsentBar();
registerServiceWorker();

