//import * as React from "react";
//import {IGenerateTaskSpecAlgorithm} from "../interfaces/IGenerateTaskSpecAlgorithm";
import {СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР} from "../constants/messages";
//import {taskSpecAlgo_Приемка} from "../taskSpecAlgorithms/taskSpecAlgo_Приемка";
import {IMessage} from "../interfaces/IMessage";
//import {taskSpecAlgo_ВзятьПаллетуВЗадание} from "../taskSpecAlgorithms/taskSpecAlgo_ВзятьПалетуВЗадание";
import {РЕГИСТР_ПАЛЛЕТА_В_ЗАДАНИИ} from "../constants/registers";
import {ICommand} from "../commander/commander";
import {
    ВидДокумента_ЗаданиеНаПриемку, ВидДокспец_ЗаданиеНаПриемТовара, ВидДокспец_ВзятьПаллетуВЗадание,
    ВидДокспец_ПриемТовара, Субконто_Паллета, Субконто_Задание, Субконто_Ячейка, Субконто_Товар,
    ВидДокспец_ВзятьКоробкуВЗадание, Субконто_Коробка
} from "../common/Buhta";

import {ISubcontoType} from "../common/registerSubcontoType";
//import {BuhtaTaskContextBarcoderScene} from "../scenes/BuhtaTaskContextBarcoderScene";
import {I_Регистр} from "../interfaces/I_Регистр";
import {I_Генерация, ГенАлгоритм, ГенОбъект, ГенЗадание, ГенКоличество} from "../interfaces/I_Генерация";
import {Регистр_НовыеПаллеты, Регистр_ПаллетаОткудаВЗадании} from "../registers/Регистр_ЗаданиеНаПриемку";

//import {BuhtaTaskContextBarcoderScene} from "../scenes/BuhtaTaskContextBarcoderScene";

export interface ITaskTargetSourcePlacesConfig {
    register: string;
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
}


export interface ITaskSpecConfig {
    taskSpecName: string;
    докспецВид: number;
    objectSubcontoType: ISubcontoType;
    //generateTaskSpecAlgorithm: IGenerateTaskSpecAlgorithm;
    autoByBarcoder: boolean;
    voiceCommand?: ICommand;
    showInContextMenu: boolean;
    contextMenuScene?: Function;//React.ComponentClass<React.ViewProperties>;
    contextMenuSceneTitle?: string;
    contextMenuSceneVoiceTitle?: string;
    generates: I_Генерация[];
}


export let TaskConfigs: ITaskConfig[] = [];

let Прием_товара_на_паллету: ITaskSpecConfig = {
    taskSpecName: "Принять товар",
    докспецВид: ВидДокспец_ПриемТовара,
    objectSubcontoType: Субконто_Товар,
    autoByBarcoder: true,
   // generateTaskSpecAlgorithm: taskSpecAlgo_Приемка,
    showInContextMenu: false,
    voiceCommand: {
        words: "товар",
        number: "REQ"
    },
    generates: []
}

let Взять_паллету_в_задание: ITaskSpecConfig = {
    taskSpecName: "Взять паллету в задание",
    докспецВид: ВидДокспец_ВзятьПаллетуВЗадание,
    objectSubcontoType: Субконто_Паллета,
    autoByBarcoder: false,
   // generateTaskSpecAlgorithm: taskSpecAlgo_ВзятьПаллетуВЗадание,
    showInContextMenu: true,
    voiceCommand: {
        words: "взять паллету",
        number: "REQ"
    },
    //contextMenuScene: BuhtaTaskContextBarcoderScene,
    contextMenuSceneTitle: "Отсканируйте штрих-код паллеты",
    contextMenuSceneVoiceTitle: "Продиктуйте штрих-код паллеты",
    generates: [{
        ДокспецВид: ВидДокспец_ВзятьПаллетуВЗадание,
        Кредит:Регистр_НовыеПаллеты,
        КрОбъект:ГенОбъект.ОбъектШтрихКода,
        КрКоличество:ГенКоличество.Единица,
        Дебет:Регистр_ПаллетаОткудаВЗадании,
        ДбОбъект:ГенОбъект.ОбъектШтрихКода,
        ДбЗадание:ГенЗадание.Задание,
        ДбКоличество:ГенКоличество.Единица,
        Алгоритм: ГенАлгоритм.Нет
    }]
}

let Взять_коробку_в_задание: ITaskSpecConfig = {
    taskSpecName: "Взять коробку в задание",
    докспецВид: ВидДокспец_ВзятьКоробкуВЗадание,
    objectSubcontoType: Субконто_Коробка,
    autoByBarcoder: false,
    //generateTaskSpecAlgorithm: taskSpecAlgo_ВзятьПаллетуВЗадание,
    showInContextMenu: true,
    voiceCommand: {
        words: "взять коробку",
        number: "REQ"
    },
  //  contextMenuScene: BuhtaTaskContextBarcoderScene,
    contextMenuSceneTitle: "Отсканируйте штрих-код коробки",
    contextMenuSceneVoiceTitle: "Продиктуйте штрих-код коробки",
    generates: []
}


export let Приемка_Товара: ITaskConfig = {
    taskName: "Приемка товара",
    документВид: ВидДокумента_ЗаданиеНаПриемку,
    sourcePlacesConfig: undefined,
    targetPlacesConfig: {
        register: РЕГИСТР_ПАЛЛЕТА_В_ЗАДАНИИ,
        allowedSubcontos: [Субконто_Паллета, Субконто_Ячейка],
        allowedCount: "single",
        title: "Куда принимаем товар",
        placesNotReadyErrorMessage: СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР,
        placesNotReadyText: "Не выбрана паллета или коробка, куда принимать товар",
        placesNotReadyTaskSpecs: [Взять_паллету_в_задание, Взять_коробку_в_задание]
    },

    stepsTitle: "Список товара",
    specConfig: []
    //generateTaskSpecAlgorithm: taskSpecAlgo_Приемка
}
Приемка_Товара.specConfig.push(Прием_товара_на_паллету);
Приемка_Товара.specConfig.push(Взять_паллету_в_задание);
Приемка_Товара.specConfig.push(Взять_коробку_в_задание);


TaskConfigs.push(Приемка_Товара);




