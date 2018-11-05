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
        super(props);

        const {
            tag,
            name,
            isApiEndpoint
        } = props;

        this.state = {
            tag: tag,
            hash: `#/${tag}`,
            name: name,
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
            elementSelector = `#operations-tag-${this.state.tag}`;
        } else {
            elementSelector = `#topic-${this.state.tag}`;
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
                <a href={ this.state.hash } onClick={ (event) => this.scrollToOperation(event) }>{ this.state.name }</a>
            </li>
        );
    }

    /**
     */
    componentDidUpdate () {
        if (!this.state.isApiEndpoint) {
            this.props.bunqSelectors.initializeScrollToTopic(this.state.tag);
        }
    }
}

export default SidebarItem;
