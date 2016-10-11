
import {ITaskSpecConfig, ITaskConfig} from "../interfaces/ITaskConfig";
import {
    Субконто_Товар, ВидДокспец_ПриемТовара, Субконто_Паллета,
    ВидДокспец_ВзятьПаллетуВЗадание, Субконто_Коробка, ВидДокумента_ЗаданиеНаПриемку, Субконто_Ячейка
} from "../common/Buhta";
import {
    Регистр_ЗаданиеНаПриемку, Регистр_СвободныйОстаток,
    Регистр_НовыеПаллеты, Регистр_ПаллетаКудаВЗадании
} from "../registers/Регистр_ЗаданиеНаПриемку";
import {ГенОбъект, ГенКоличество, ГенЗадание, ГенАлгоритм, ГенМесто} from "../interfaces/I_Генерация";
import {СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР} from "../constants/messages";

export let Прием_товара_на_паллету: ITaskSpecConfig = {
    taskSpecName: "Принять товар",
    objectSubcontoType: Субконто_Товар,
    autoByBarcoder: true,
    showInContextMenu: false,
    voiceCommand: {
        words: "товар",
        number: "REQ"
    },
    genOkMessage: {
        sound:"tovar-ok.mp3",
        voice: "товар принят на",
        toast: "товар принят на",
    },
    generates: [{
        ДокспецВид: ВидДокспец_ПриемТовара,
        Кредит: {
            Счет: Регистр_ЗаданиеНаПриемку,
            Объект: ГенОбъект.ОбъектШтрихКода,
            Задание: ГенЗадание.Задание,
            Количество: ГенКоличество.Единица
        },
        Дебет: {
            Счет: Регистр_СвободныйОстаток,
            Место: ГенМесто.ПаллетаКуда,
            Объект: ГенОбъект.ОбъектШтрихКода,
            Количество: ГенКоличество.КоличествоШтрихКода
        },
        Алгоритм: ГенАлгоритм.Нет
    }]
}

export let Взять_паллету_в_задание: ITaskSpecConfig = {
    taskSpecName: "Взять паллету в задание",
    objectSubcontoType: Субконто_Паллета,
    autoByBarcoder: false,
    showInContextMenu: true,
    voiceCommand: {
        words: "взять паллету",
        number: "REQ"
    },
    contextMenuSceneTitle: "Отсканируйте штрих-код паллеты",
    contextMenuSceneVoiceTitle: "Продиктуйте штрих-код паллеты",
    genOkMessage:{
        sound:"pallete-ok.mp3",
        voice: "паллета взята в работу",
        toast: "паллета взята в работу",
    },
    generates: [{
        ДокспецВид: ВидДокспец_ВзятьПаллетуВЗадание,
        Кредит: {
            Счет: Регистр_НовыеПаллеты,
            Объект: ГенОбъект.ОбъектШтрихКода,
            Количество: ГенКоличество.Единица
        },
        Дебет: {
            Счет: Регистр_ПаллетаКудаВЗадании,
            Объект: ГенОбъект.ОбъектШтрихКода,
            Задание: ГенЗадание.Задание,
            Количество: ГенКоличество.Единица
        },
        Алгоритм: ГенАлгоритм.Нет
    }]
}

export let Взять_коробку_в_задание: ITaskSpecConfig = {
    taskSpecName: "Взять коробку в задание",
    objectSubcontoType: Субконто_Коробка,
    autoByBarcoder: false,
    showInContextMenu: true,
    voiceCommand: {
        words: "взять коробку",
        number: "REQ"
    },
    //  contextMenuScene: BuhtaTaskContextBarcoderScene,
    contextMenuSceneTitle: "Отсканируйте штрих-код коробки",
    contextMenuSceneVoiceTitle: "Продиктуйте штрих-код коробки",
    genOkMessage:{
        sound:"box-ok.mp3",
        voice: "коробка взята в работу",
        toast: "коробка взята в работу",
    },
    generates: []
}


export let Задание_ПриемкаТовара: ITaskConfig = {
    taskName: "Приемка товара",
    документВид: ВидДокумента_ЗаданиеНаПриемку,
    sourcePlacesConfig: undefined,
    targetPlacesConfig: {
        register: Регистр_ПаллетаКудаВЗадании,
        allowedSubcontos: [Субконто_Паллета, Субконто_Ячейка],
        allowedCount: "single",
        title: "Куда принимаем товар",
        placesNotReadyErrorMessage: СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР,
        placesNotReadyText: "Не выбрана паллета или коробка, куда принимать товар",
        placesNotReadyTaskSpecs: [Взять_паллету_в_задание, Взять_коробку_в_задание]
    },

    stepsTitle: "Список товара",
    specConfig: [
        Прием_товара_на_паллету,
        Взять_паллету_в_задание,
        Взять_коробку_в_задание
    ]

}





