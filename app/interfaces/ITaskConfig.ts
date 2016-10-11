import {IMessage} from "./IMessage";
import {ICommand} from "../commander/commander";
import {ISubcontoType} from "../common/registerSubcontoType";
import {I_Регистр} from "./I_Регистр";
import {I_Генерация, ГенАлгоритм, ГенОбъект, ГенЗадание, ГенКоличество, ГенМесто} from "./I_Генерация";

export interface ITaskTargetSourcePlacesConfig {
    register: I_Регистр;
    allowedSubcontos: ISubcontoType[];
    allowedCount: "none" | "single" | "multi";
    title: string;
    placesNotReadyErrorMessage: IMessage;
    placesNotReadyText: string;
    placesNotReadyTaskSpecs: ITaskSpecConfig[];
}


export interface ITaskConfig {
    taskName: string;
    документВид: number;
    sourcePlacesConfig?: ITaskTargetSourcePlacesConfig;
    targetPlacesConfig?: ITaskTargetSourcePlacesConfig;
    stepsTitle: string;
    specConfig: ITaskSpecConfig[];
    disabled?:boolean;
}


export interface ITaskSpecConfig {
    taskSpecName: string;
    objectSubcontoType: ISubcontoType;
    autoByBarcoder: boolean;
    voiceCommand?: ICommand;
    showInContextMenu: boolean;
    contextMenuSceneTitle?: string;
    contextMenuSceneVoiceTitle?: string;
    generates: I_Генерация[];
    genOkMessage: IMessage;
    disabled?:boolean;
}

