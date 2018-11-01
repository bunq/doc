import React from "react";
import zenscroll from "zenscroll";

/**
 * @author Nicola Parrello <nparrello@bunq.com>
 * @since  20181019 Initial creation.
 */
class SidebarItem extends React.Component {
    /**
     * @param {Object} props
     */
    constructor (props: Object) {
        const {
            tag,
            name,
            isApiEndpoint
        } = props;

        super(props);

        this.tag = tag;
        this.hash = `#/${this.tag}`;
        this.name = name;
        this.isApiEndpoint = isApiEndpoint || false;
    }

    /**
     * @param {Event} event
     */
    scrollToOperation (event: Event) {
        let elementSelector;

        event.preventDefault();

        window.history.pushState(null, null, this.hash);

        if (this.isApiEndpoint) {
            elementSelector = `#operations-tag-${this.tag}`;
        } else {
            elementSelector = `#topic-${this.tag}`;
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
        return (
            <li>
                <a href={ this.hash } onClick={ this.scrollToOperation.bind(this) }>{ this.name }</a>
            </li>
        );
    }
}

export default SidebarItem;
