import {I_Регистр} from "./I_Регистр";

export interface  ГенФункция {
    (): void;
}

export enum ГенМесто { Нет, Задание, Договор, ПаллетаОткуда, ПаллетаКуда, Сотрудник, ОбъектШтрихКода, FIFO, Функция}
export enum ГенОбъект { Нет, Задание, Договор, ПаллетаОткуда, ПаллетаКуда, Сотрудник, ОбъектШтрихКода, FIFO, Функция}
export enum ГенДоговор { Нет, Сотрудник, ОбъектШтрихКода, FIFO, Функция}
export enum ГенЗадание { Нет, Задание, ОбъектШтрихКода, FIFO, Функция}
export enum ГенСотрудник { Нет, Договор, ОбъектШтрихКода, FIFO, Функция}
export enum ГенКоличество { Нет, Единица, FIFO, КоличествоШтрихКода, Функция}
export enum ГенАлгоритм { Нет, FIFO}

export interface I_Генерация {
    Дебет?: I_Регистр;
    ДбМесто?: ГенМесто;
    ДбОбъект?: ГенОбъект;
    ДбДоговор?: ГенДоговор;
    ДбЗадание?: ГенЗадание;
    ДбСотрудник?: ГенСотрудник;
    ДбКоличество?: ГенКоличество;

    Кредит?: I_Регистр;
    КрМесто?: ГенМесто;
    КрОбъект?: ГенОбъект;
    КрДоговор?: ГенДоговор;
    КрЗадание?: ГенЗадание;
    КрСотрудник?: ГенСотрудник;
    КрКоличество?: ГенКоличество;

    ДбМестоФункция?: ГенФункция;
    ДбОбъектФункция?: ГенФункция;
    ДбДоговорФункция?: ГенФункция;
    ДбЗаданиеФункция?: ГенФункция;
    ДбСотрудникФункция?: ГенФункция;
    ДбКоличествоФункция?: ГенФункция;

    КрМестоФункция?: ГенФункция;
    КрОбъектФункция?: ГенФункция;
    КрДоговорФункция?: ГенФункция;
    КрЗаданиеФункция?: ГенФункция;
    КрСотрудникФункция?: ГенФункция;
    КрКоличествоФункция?: ГенФункция;

    Алгоритм: ГенАлгоритм;
    ДокспецВид: number;
}
