if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        // regiser the service worker on load
        navigator.serviceWorker
            .register("service-worker.js")
            .then(function(registration) {
                // updatefound is fired if service-worker.js changes.
                registration.onupdatefound = function() {
                    // listen for changes in the service worker's state
                    registration.installing.onstatechange = function() {
                        switch (this.state) {
                            case "installed":
                                if (navigator.serviceWorker.controller) {
                                    // an existing installation has been updated
                                    console.log(
                                        "New or updated content is available."
                                    );
                                } else {
                                    // a new installation
                                    console.log(
                                        "Content is now available offline!"
                                    );
                                }
                                break;
                            case "redundant":
                                console.error(
                                    "The installing service worker became redundant."
                                );
                                break;
                        }
                    };
                };
            })
            .catch(function(error) {
                console.error(
                    "Error during service worker registration:",
                    error
                );
            });
    });
}
