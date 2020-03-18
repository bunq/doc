import React from "react";

import { allSidebarItemType } from "helpers/docLib";

/**
 * @author Nicola Parrello <nparrello@bunq.com>
 * @since  20181009 Initial creation.
 */
class Sidebar extends React.Component {
    /**
     * @type {Object[]}
     */
    static allResourceInternal = [
        {
            destination: "introduction",
            name: "Introduction"
        },
        {
            destination: "oauth",
            name: "OAuth"
        },
        {
            destination: "authentication",
            name: "Authentication"
        },
        {
            destination: "psd2",
            name: "PSD2 service provider"
        },
        {
            destination: "signing",
            name: "Signing"
        },
        {
            destination: "headers",
            name: "Headers"
        },
        {
            destination: "errors",
            name: "Errors"
        },
        {
            destination: "api-conventions",
            name: "API conventions"
        },
        {
            destination: "callbacks",
            name: "Callbacks"
        },
        {
            destination: "pagination",
            name: "Pagination"
        },
        {
            destination: "moving-to-production",
            name: "Moving to production"
        },
        {
            destination: "android-emulator",
            name: "Android emulator"
        },
        {
            destination: "quickstart-opening-a-session",
            name: "Quickstart: Opening a Session"
        },
        {
            destination: "quickstart-payment-request",
            name: "Quickstart: Payment Request"
        },
        {
            destination: "quickstart-create-a-tab-payment",
            name: "Quickstart: Create a Tab payment"
        },
        {
            destination: "quickstart-transwerwise-payment",
            name: "Quickstart: Create a TransferWise payment"
        }
    ];

    /**
     * @type {Object[]}
     */
    static allResourceExternal = [
        {
            destination: "https://beta.doc.bunq.com/basics/changelog",
            name: "Changelog"
        },
        {
            destination: "https://github.com/bunq",
            name: "GitHub"
        },
        {
            destination: "https://status.bunq.com",
            name: "bunq status"
        }
    ];

    /**
     * @returns {Node}
     */
    render (): Node {
        const { getComponent } = this.props;
        const SidebarItem = getComponent("SidebarItem", true);
        const operationTags = this.props.bunqSelectors.getSidebarEndpoints();

        return (
            <div className="sidebar">
                <a href="https://www.bunq.com" className="sidebar-logo-container">
                    <span className="sidebar-logo"></span>
                </a>

                <h3 className="sidebar-title">TOPICS</h3>
                <ul className="sidebar-list">
                    {
                        Sidebar.allResourceInternal.map((topic: Object, index: number): Element => {
                            return (
                                <SidebarItem key={ index } destination={ topic.destination } name={ topic.name } type={ allSidebarItemType.INTERNAL } />
                            );
                        })
                    }
                </ul>

                <h3 className="sidebar-title">LINKS</h3>
                <ul className="sidebar-list">
                    {
                        Sidebar.allResourceExternal.map((topic: Object, index: number): Element => {
                            return (
                                <SidebarItem key={ index } destination={ topic.destination } name={ topic.name } type={ allSidebarItemType.EXTERNAL } />
                            );
                        })
                    }
                </ul>

                <h3 className="sidebar-title">RESOURCES</h3>
                <ul className="sidebar-list">
                    {
                        operationTags.map((destination: string, index: number): Element => {
                            return (
                                <SidebarItem key={ index } destination={ destination } name={ destination } type={ allSidebarItemType.INTERNAL } isApiEndpoint={ true } />
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default Sidebar;
