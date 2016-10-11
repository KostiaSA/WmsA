import {IMessage} from "./IMessage";
import {ICommand} from "../commander/commander";
import {ISubcontoType} from "../common/registerSubcontoType";
import {I_Регистр} from "./I_Регистр";
import {I_Генерация, ГенАлгоритм, ГенОбъект, ГенЗадание, ГенКоличество, ГенМесто} from "./I_Генерация";
import {IWorkflowRun} from "./IWorkflowRun";


export interface IWorkflowConfig {
    имя: string;
    документВид?: number;
    отключен?: boolean;
    счет: I_Регистр;
    алгоритм: IWorkflowRun;
}


