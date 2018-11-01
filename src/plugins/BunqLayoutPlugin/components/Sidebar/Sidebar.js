import React from "react";
import SidebarItem from "../SidebarItem/SidebarItem";

/**
 * @author Nicola Parrello <nparrello@bunq.com>
 * @since  20181009 Initial creation.
 */
class Sidebar extends React.Component {
    /**
     * @type {Object[]}
     */
    static topics = [
        {
            tag: "introduction",
            name: "Introduction"
        },
        {
            tag: "oauth",
            name: "OAuth"
        },
        {
            tag: "authentication",
            name: "Authentication"
        },
        {
            tag: "signing",
            name: "Signing"
        },
        {
            tag: "headers",
            name: "Headers"
        },
        {
            tag: "errors",
            name: "Errors"
        },
        {
            tag: "api-conventions",
            name: "API Conventions"
        },
        {
            tag: "callbacks",
            name: "Callbacks"
        },
        {
            tag: "pagination",
            name: "Pagination"
        },
        {
            tag: "moving-to-production",
            name: "Moving to Production"
        },
        {
            tag: "android-emulator",
            name: "Android Emulator"
        },
        {
            tag: "quickstart-opening-a-session",
            name: "Quickstart: Opening a Session"
        },
        {
            tag: "quickstart-payment-request",
            name: "Quickstart: Payment Request"
        },
        {
            tag: "quickstart-create-a-tab-payment",
            name: "Quickstart: Create a Tab payment"
        }
    ];

    /**
     * @returns {Node}
     */
    render (): Node {
        const {
            getSidebarEndpoints,
            initializeScrollToTopic
        } = this.props;
        const operationTags = getSidebarEndpoints();

        return (
            <div className="sidebar">
                <a href="https://www.bunq.com" className="sidebar-logo-container">
                    <span className="sidebar-logo"></span>
                </a>

                <h3 className="sidebar-title">TOPICS</h3>
                <ul className="sidebar-list">
                    {
                        Sidebar.topics.map((topic: Object, index: number): Element => {
                            initializeScrollToTopic(topic.tag);

                            return (
                                <SidebarItem key={ index } tag={ topic.tag } name={ topic.name } />
                            );
                        })
                    }
                </ul>

                <h3 className="sidebar-title">RESOURCES</h3>
                <ul className="sidebar-list">
                    {
                        operationTags.map((tag: string, index: number): Element => {
                            return (
                                <SidebarItem key={ index } tag={ tag } name={ tag } isApiEndpoint={ true } />
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default Sidebar;
