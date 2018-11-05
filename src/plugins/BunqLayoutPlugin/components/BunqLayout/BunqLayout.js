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
            <div className="wrapper">
                {
                    this.renderSidebar()
                }
                <BaseLayout />
            </div>
        );
    }

    /**
     * @returns {Node}
     */
    renderSidebar (): Node {
        const { getComponent } = this.props;
        const Sidebar = getComponent("Sidebar", true);
        const loadingStatus = this.props.specSelectors.loadingStatus();

        if ("success" === loadingStatus) {
            return <Sidebar {...this.props} />;
        } else {
            return null;
        }
    }
}

export default BunqLayout;
