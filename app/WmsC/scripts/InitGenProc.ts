import {consoleOk, consoleError, consoleLog} from "../core/console";
import {loadWmsConfigApp} from "../loadWmsConfigApp";
import {ITaskConfig, ITaskSpecConfig} from "../../interfaces/ITaskConfig";
import {create_proc_Генерация} from "../gen-stored-proc/create_proc_Генерация";
import {TaskConfigsList} from "../../tasks/taskConfigList";


loadWmsConfigApp();


let allProcs: Promise<void>[] = [];

TaskConfigsList.forEach((task: ITaskConfig)=> {
    task.specConfig.forEach((spec: ITaskSpecConfig)=> {
        allProcs.push(create_proc_Генерация(task, spec));
    });
});

Promise.all(allProcs)
    .then(()=> {
        console.log("\n");
        consoleOk("init-gen-proc", "Ok")
        process.exit();
    })
    .catch((err: any)=> {
        consoleError("init-gen-proc-error", err);
        process.exit();
    });

