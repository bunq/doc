import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @author Nicola Parrello <nparrello@bunq.com>
 * @since  20190403 Initial creation.
 */
class FloaterItem extends React.Component {
    /**
     * @param {Object} props
     */
    constructor (props: Object) {
        super(props);

        const { resource } = props;

        this.state = {
            destination: resource.destination,
            name: resource.name,
            icon: resource.icon
        };
    }

    /**
     * @returns {Node}
     */
    render (): Node {
        return (
            <div className={ "floater-item" }>
                <a href={ this.state.destination } target={ "_blank" }>
                    <FontAwesomeIcon
                        icon={
                            ["fab", this.state.icon]
                        }
                        title={ this.state.name }
                        size={ "3x" }
                    />
                </a>
            </div>
        );
    }
}

export default FloaterItem;
