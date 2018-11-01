import React from "react";
import Sidebar from "../Sidebar/Sidebar";

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
                <Sidebar {...this.props} />
                <BaseLayout />
            </div>
        );
    }
}

export default BunqLayout;
