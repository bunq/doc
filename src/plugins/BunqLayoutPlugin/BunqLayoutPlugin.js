// @flow
import BunqLayout from "plugins/BunqLayoutPlugin/components/BunqLayout/BunqLayout";
import Floater from "plugins/BunqLayoutPlugin/components/Floater/Floater";
import FloaterItem from "plugins/BunqLayoutPlugin/components/FloaterItem/FloaterItem";
import Sidebar from "plugins/BunqLayoutPlugin/components/Sidebar/Sidebar";
import SidebarItem from "plugins/BunqLayoutPlugin/components/SidebarItem/SidebarItem";

/**
 * @type {Object}
 */
const actions = {
    /**
     * @param {Object} apiSpecification
     *
     * @returns {Object}
     */
    updateSidebarEndpoints: (apiSpecification: Object): Object => {
        const tags = [];

        if (apiSpecification.tags) {
            for (const tag of apiSpecification.tags) {
                tags.push(tag.name);
            }
        }

        return {
            type: "BUNQ_UPDATE_SIDEBAR_ENDPOINTS",
            payload: tags
        }
    },

    /**
     * @param {Function} originalAction
     * @param {Object} system
     *
     * @returns {Object}
     */
    updateApiSpecification: (
        originalAction: Function,
        system: Object
    ): Object => (apiSpecification: Object): Object => {
        system.bunqActions.updateSidebarEndpoints(JSON.parse(apiSpecification));

        return originalAction(apiSpecification);
    },

    /**
     * @param {Function} originalAction
     * @param {Object} system
     */
    readyToScrollSupportLegacyUrls: (
        originalAction: Function,
        system: Object
    ): Object => (operation: Object, element: Element): Object => {
        let requestedOperation = system.layoutSelectors.getScrollToKey();

        /*
         * Always tries to scroll to the operation-tag (e.g. session-server), so that if the requested url is old
         * or does not exist anymore at least the visitor is brought to a relevant resource.
         */
        if (requestedOperation) {
            requestedOperation = requestedOperation.toJS();

            if ("operations" === requestedOperation[0] && requestedOperation[1] === operation[1]) {
                originalAction(requestedOperation, element);
            }
        }

        originalAction(operation, element);
    }
};

/**
 * @type {Object}
 */
const reducers = {
    /**
     * @param {Object} state
     * @param {Object} action
     *
     * @returns {Object}
     */
    updateSidebarEndpoints: (state: Object, action: Object): Object => {
        return state.set("tags", action.payload);
    }
};

/**
 * @type {Object}
 */
const selectors = {
    /**
     * @param {Object} state
     *
     * @returns {Object[]}
     */
    getSidebarEndpoints: (state: Object): Object[] => {
        return state.get("tags") || [];
    },

    /**
     * @param {Object} state
     * @param {string} tag
     */
    initializeScrollToTopic: (state: Object, tag: string) => (system: Object) => {
        const element = document.querySelector(`#topic-${tag}`);

        if (element) {
            system.layoutActions.readyToScroll(["topic", tag], element.parentElement);
        }
    },

    /**
     * @param {Function} originalSelector
     * @param {Object} system
     *
     * @returns {string[]}
     */
    getIsShownKeyFromUrlHashArray: (
        originalSelector: Function,
        system: Object
    ): string[] => (state: Object, urlHashKey: string[]): string[] => {
        const isShownKey = originalSelector(urlHashKey);

        if ("operations-tag" === isShownKey[0]) {
            for (const topic of Sidebar.topics) {
                if (topic.tag === isShownKey[1]) {
                    return ["topic", isShownKey[1]];
                }
            }
        }

        return isShownKey;
    }
};

/**
 * @returns {Object}
 */
const BunqLayoutPlugin = (): Object => {
    return {
        components: {
            BunqLayout: BunqLayout,
            Floater: Floater,
            FloaterItem: FloaterItem,
            Sidebar: Sidebar,
            SidebarItem: SidebarItem
        },
        statePlugins: {
            bunq: {
                actions: {
                    updateSidebarEndpoints: actions.updateSidebarEndpoints
                },
                reducers: {
                    "BUNQ_UPDATE_SIDEBAR_ENDPOINTS": reducers.updateSidebarEndpoints
                },
                selectors: {
                    getSidebarEndpoints: selectors.getSidebarEndpoints,
                    initializeScrollToTopic: selectors.initializeScrollToTopic
                }
            },
            layout: {
                wrapActions: {
                    readyToScroll: actions.readyToScrollSupportLegacyUrls
                },
                wrapSelectors: {
                    isShownKeyFromUrlHashArray: selectors.getIsShownKeyFromUrlHashArray
                }
            },
            spec: {
                wrapActions: {
                    updateSpec: actions.updateApiSpecification
                }
            }
        }
    }
};

export default BunqLayoutPlugin;
