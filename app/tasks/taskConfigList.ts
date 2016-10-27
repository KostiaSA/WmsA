import {ITaskConfig} from "../interfaces/ITaskConfig";
import {Задание_ПриемкаТовара} from "./Задание_ПриемкаТовара";
import {Задание_ПеремещениеПаллеты} from "./Задание_ПеремещениеПаллеты";

export let TaskConfigsList: ITaskConfig[] = [
    Задание_ПриемкаТовара,
    Задание_ПеремещениеПаллеты
];