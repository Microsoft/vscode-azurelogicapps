/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode, IAzureParentNode, IAzureTreeItem } from "vscode-azureextensionui";

export async function openAndShowTextDocument(content: string, language = "json"): Promise<void> {
    const document = await vscode.workspace.openTextDocument({
        content,
        language
    });

    await vscode.window.showTextDocument(document);
}

export async function createChildNode(tree: AzureTreeDataProvider, parentContextValue: string, node?: IAzureParentNode): Promise<IAzureNode<IAzureTreeItem>> {
    if (!node) {
        node = await tree.showNodePicker(parentContextValue) as IAzureParentNode;
    }

    return await node.createChild();
}
