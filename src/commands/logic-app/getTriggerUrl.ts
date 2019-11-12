/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { LogicAppTriggerTreeItem } from "../../tree/logic-app/LogicAppTriggerTreeItem";
import * as vscode from "vscode";

export async function getTriggerUrl(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTriggerTreeItem.contextValue);
    }

    node.runWithTemporaryDescription(
        localize("azLogicApps.running", "Working..."),
        async () => {
            const logicAppTriggerTreeItem = node!.treeItem as LogicAppTriggerTreeItem;
            let callbackUrl = await logicAppTriggerTreeItem.callbackUrl;
            await vscode.env.clipboard.writeText(<string>callbackUrl.value);
        }
    );
}
