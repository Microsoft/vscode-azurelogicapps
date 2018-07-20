import * as vscode from "vscode";
import { BaseEditor, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../localize";
import { LogicAppTreeItem } from "../tree/LogicAppTreeItem";

export class LogicAppEditor extends BaseEditor<IAzureNode<LogicAppTreeItem>> {
    constructor() {
        super("azureLogicApps.showSavePrompt");
    }

    public async getData(node: IAzureNode<LogicAppTreeItem>): Promise<string> {
        return node.treeItem.getData();
    }

    public async getFilename(node: IAzureNode<LogicAppTreeItem>): Promise<string> {
        return `${node.treeItem.label}.logicapp.json`;
    }

    public async getSaveConfirmationText(node: IAzureNode<LogicAppTreeItem>): Promise<string> {
        const { label } = node.treeItem;
        return localize("azLogicApps.saveConfirmationText", "Saving '{0}' will update the Logic App definition in your subscription.", label);
    }

    public async getSize(_: IAzureNode<LogicAppTreeItem>): Promise<number> {
        return 0;
    }

    public async updateData(node: IAzureNode<LogicAppTreeItem>): Promise<string> {
        if (!vscode.window.activeTextEditor) {
            throw new Error(localize("azLogicApps.errorUpdatingFile", "Cannot update Logic App after it has been closed."));
        }

        return await node.treeItem.update(vscode.window.activeTextEditor.document.getText());
    }
}