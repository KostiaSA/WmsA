import {IWorkflowConfig} from "./IWorkflowConfig";

export interface IWorkflowRun {
    (work:IWorkflowConfig):Promise<void>;
}


