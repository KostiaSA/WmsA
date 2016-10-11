import {IWorkflowConfig} from "../../interfaces/IWorkflowConfig";

export function workflowRun(work: IWorkflowConfig): Promise<void> {
    return work.алгоритм(work);
}
