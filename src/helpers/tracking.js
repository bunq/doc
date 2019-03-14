// @flow
/**
 */
export default function initializeCookieConsentBar() {
    window.addEventListener("load", () => {
        var shouldAddMotionListeners = true;

        window.cookieconsent.initialise({
            position: "bottom",
            content: {
                message: "We use cookies when you continue to use our website.",
                dismiss: "got it!",
                link: "Learn more",
                href: "https://www.bunq.com/privacy"
            },
            container: document.querySelector(".react-root"),
            onInitialise: function () {
                if (this.hasConsented()) {
                    initializeAllTracking();

                    shouldAddMotionListeners = false;
                }
            }
        });

        if (window.cookieconsent.hasInitialised && shouldAddMotionListeners) {
            window.addEventListener("scroll", initializeAllTracking);
            window.addEventListener("keydown", initializeAllTracking);
            window.addEventListener("mousedown", initializeAllTracking);
            window.addEventListener("touchstart", initializeAllTracking);
        }
    });
}

/**
 */
function initializeAllTracking() {
    initializeGoogleTagManagerIfNeeded();

    window.removeEventListener("scroll", initializeAllTracking);
    window.removeEventListener("keydown", initializeAllTracking);
    window.removeEventListener("mousedown", initializeAllTracking);
    window.removeEventListener("touchstart", initializeAllTracking);
}

/**
 */
function initializeGoogleTagManagerIfNeeded() {
    const googleTagManagerContainerId = process.env.REACT_APP_GOOGLE_TAG_MANAGER_CONTAINER_ID;

    if (googleTagManagerContainerId) {
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                "gtm.start": new Date().getTime(),
                event: "gtm.js"
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l !== "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            f.parentNode.insertBefore(j, f);
        }) (window, document, "script", "dataLayer", googleTagManagerContainerId);
    }
}
