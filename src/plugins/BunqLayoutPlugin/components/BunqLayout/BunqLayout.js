import React from "react";

/**
 * @author Nicola Parrello <nparrello@bunq.com>
 * @since  20181005 Initial creation.
 */
class BunqLayout extends React.Component {
    /**
     * @returns {Node}
     */
    render (): Node {
        const { getComponent } = this.props;
        const BaseLayout = getComponent("BaseLayout", true);

        return (
            <div className="doc-wrapper">
                {
                    this.renderAllElementAfterInitialization()
                }
                <BaseLayout />
            </div>
        );
    }

    /**
     * @returns {Node}
     */
    renderAllElementAfterInitialization (): Node {
        const { getComponent } = this.props;
        const loadingStatus = this.props.specSelectors.loadingStatus();

        const Sidebar = getComponent("Sidebar", true);
        const Floater = getComponent("Floater", true);

        if ("success" === loadingStatus) {
            return (
                <div>
                    <Sidebar {...this.props} />
                    <Floater {...this.props} />
                </div>
            );
        } else {
            return null;
        }
    }
}

export default BunqLayout;
