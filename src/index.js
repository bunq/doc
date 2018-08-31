// @flow
import SwaggerUI from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";

import registerServiceWorker from "./helpers/registerServiceWorker";
import { DisableTryItOutPlugin } from "./plugins";
import "./scss/index.css"

SwaggerUI({
    url: "https://raw.githubusercontent.com/bunq/doc/master/swagger.json",
    dom_id: "#root",
    deepLinking: true,
    plugins: [
        DisableTryItOutPlugin
    ]
});

registerServiceWorker();
