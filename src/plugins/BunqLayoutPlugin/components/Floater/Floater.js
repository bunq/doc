import React from "react";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
    faGithub,
    faStackOverflow
} from "@fortawesome/free-brands-svg-icons";

import { iconTogether } from "helpers/bunqIcons";

/**
 * @author Nicola Parrello <nparrello@bunq.com>
 * @since  20190402 Initial creation.
 */
class Floater extends React.Component {
    /**
     * @type {Object[]}
     */
    static allResource = [
        {
            destination: "https://github.com/bunq",
            name: "GitHub",
            icon: "github"
        },
        {
            destination: "https://stackoverflow.com/search?q=bunq",
            name: "Stack Overflow",
            icon: "stack-overflow"
        },
        {
            destination: "https://together.bunq.com/t/api",
            name: "bunq Together",
            icon: "together"
        }
    ];

    /**
     * @param {Object} props
     */
    constructor (props: Object) {
        super(props);

        library.add([
            faGithub,
            faStackOverflow,
            iconTogether
        ]);

        dom.watch();
    }

    /**
     * @returns {Node}
     */
    render (): Node {
        const { getComponent } = this.props;
        const FloaterItem = getComponent("FloaterItem", true);

        return (
            <div className="floater">
                <div className="floater-list">
                    {
                        Floater.allResource.map((resource: Object, index: number): Element => {
                            return (
                                <FloaterItem key={ index } resource={ resource } />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Floater;
