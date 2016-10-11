import {WorkflowConfigsList} from "../workflow/workflowConfigList";
import {IWorkflowConfig} from "../../interfaces/IWorkflowConfig";

// старт сервера
console.log("БУХта WMS. Workflow сервер стартует...");

WorkflowConfigsList.forEach((work: IWorkflowConfig)=> {
    console.log("  " + work.имя);
    setInterval(()=> {
        work.алгоритм(work);
    }, 2000);
})