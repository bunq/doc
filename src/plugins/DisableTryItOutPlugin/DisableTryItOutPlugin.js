// @flow
const DisableTryItOutPlugin = () => {
    return {
        statePlugins: {
            spec: {
                wrapSelectors: {
                    allowTryItOutFor: () => () => false
                }
            }
        }
    }
};

export default DisableTryItOutPlugin;
