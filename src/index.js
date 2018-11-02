// @flow
import SwaggerUIStandalonePreset from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";

import registerServiceWorker from "./helpers/registerServiceWorker";
import {
    BunqLayoutPlugin,
    DisableTryItOutPlugin
} from "./plugins";
import "./scss/index.css";

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

registerServiceWorker();
