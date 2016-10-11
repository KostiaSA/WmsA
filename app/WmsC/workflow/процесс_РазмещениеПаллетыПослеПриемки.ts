import {IWorkflowConfig} from "../../interfaces/IWorkflowConfig";
import {Регистр_workflow_ПаллетыДляРазмещения} from "../../registers/Регистр_ЗаданиеНаПриемку";
import {алгоритм_РазмещениеПаллеты} from "../workflowAlgorithm/алгоритм_РазмещениеПаллеты";
/**
 * Created by Kostia on 11.10.2016.
 */

export let процесс_РазмещениеПаллетыПослеПриемки: IWorkflowConfig = {
    имя: "Размещение паллеты после приемки",
    счет: Регистр_workflow_ПаллетыДляРазмещения,
    алгоритм: алгоритм_РазмещениеПаллеты
}