import LogicAppsManagementClient = require("azure-arm-logic");
import { Workflow } from "azure-arm-logic/lib/models";
import { IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { getIconPath } from "../utils/nodeUtils";
import { LogicAppRunsTreeItem } from "./LogicAppRunsTreeItem";
import { LogicAppVersionsTreeItem } from "./LogicAppVersionsTreeItem";

export class LogicAppTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azLogicAppsWorkflow";
    public contextValue = LogicAppTreeItem.contextValue;
    public logicAppRunsItem: LogicAppRunsTreeItem;
    public logicAppVersionsItem: LogicAppVersionsTreeItem;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly workflow: Workflow) {
        this.logicAppRunsItem = new LogicAppRunsTreeItem(client, workflow);
        this.logicAppVersionsItem = new LogicAppVersionsTreeItem(client, workflow);
    }

    public get iconPath(): string {
        return getIconPath(LogicAppTreeItem.contextValue);
    }

    public get id(): string {
        return this.workflow.id!;
    }

    public get label(): string {
        return this.workflow.name!;
    }

    public get resourceGroupName(): string {
        return this.workflow.id!.split("/").slice(-5, -4)[0];
    }

    public get workflowName(): string {
        return this.workflow.name!;
    }

    public hasMoreChildren(): boolean {
        return false;
    }

    public async deleteTreeItem(): Promise<void> {
        await this.client.workflows.deleteMethod(this.resourceGroupName, this.workflowName);
    }

    public async disable(): Promise<void> {
        await this.client.workflows.disable(this.resourceGroupName, this.workflowName);
    }

    public async enable(): Promise<void> {
        await this.client.workflows.enable(this.resourceGroupName, this.workflowName);
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.workflow.definition, null, 4);
    }

    public async loadMoreChildren(): Promise<IAzureTreeItem[]> {
        return [
            this.logicAppRunsItem,
            this.logicAppVersionsItem
        ];
    }

    public pickTreeItem(expectedContextValue: string): IAzureTreeItem | undefined {
        switch (expectedContextValue) {
            case LogicAppRunsTreeItem.contextValue:
                return this.logicAppRunsItem;

            case LogicAppVersionsTreeItem.contextValue:
                return this.logicAppVersionsItem;

            default:
                return undefined;
        }
    }

    public async update(definition: string): Promise<string> {
        const workflow = {
            ...this.workflow,
            definition: JSON.parse(definition)
        };
        const updatedWorkflow = await this.client.workflows.createOrUpdate(this.resourceGroupName, this.workflowName, workflow);
        return JSON.stringify(updatedWorkflow.definition, null, 4);
    }
}