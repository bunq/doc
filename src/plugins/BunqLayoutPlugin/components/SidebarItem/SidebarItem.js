import React from "react";
import zenscroll from "zenscroll";

import { allSidebarItemType } from "helpers/docLib";

/**
 * @author Nicola Parrello <nparrello@bunq.com>
 * @since  20181019 Initial creation.
 */
class SidebarItem extends React.Component {
    /**
     * @param {Object} props
     */
    constructor (props: Object) {
        super(props);

        const {
            destination,
            name,
            type,
            isApiEndpoint
        } = props;

        this.state = {
            destination: destination,
            hash: `#/${destination}`,
            name: name,
            type: type,
            isApiEndpoint: isApiEndpoint || false
        };
    }

    /**
     * @param {Event} event
     */
    scrollToOperation (event: Event) {
        let elementSelector;

        event.preventDefault();

        window.history.pushState(null, null, this.state.hash);

        if (this.state.isApiEndpoint) {
            elementSelector = `#operations-tag-${this.state.destination}`;
        } else {
            elementSelector = `#topic-${this.state.destination}`;
        }

        window.setTimeout(() => {
            const scrollContainer = document.querySelector(".swagger-ui");
            const element = document.querySelector(elementSelector);

            if (element) {
                const scroller = zenscroll.createScroller(scrollContainer);

                scroller.to(element.parentElement);
            }
        }, 200);
    }

    /**
     * @returns {Node}
     */
    render (): Node {
        const label = this.state.name;
        let anchor;

        if (allSidebarItemType.EXTERNAL === this.state.type) {
            anchor = <a href={ this.state.destination } target={ "_blank" }>{ label }</a>;
        } else {
            anchor = <a href={ this.state.hash } onClick={ (event) => this.scrollToOperation(event) }>{ label }</a>;
        }


        return (
            <li>{ anchor }</li>
        );
    }

    /**
     */
    componentDidUpdate () {
        if (allSidebarItemType.INTERNAL === this.state.type && !this.state.isApiEndpoint) {
            this.props.bunqSelectors.initializeScrollToTopic(this.state.destination);
        }
    }
}

export default SidebarItem;
