import {ISubcontoType} from "../common/registerSubcontoType";

export interface I_Регистр {
    Счет: string;
    МестоТипы: ISubcontoType[];
    ОбъектТипы: ISubcontoType[];
    ДоговорПриходаТипы: ISubcontoType[];
    ЗаданиеТипы: ISubcontoType[];
    СотрудникТипы: ISubcontoType[];
    Количество: boolean;
    disabled: boolean;
}


// ,[МестоТип]
//     ,[Место]
//     ,[ОбъектТип]
//     ,[Объект]
//     ,[ДоговорПриходаТип]
//     ,[ДоговорПрихода]
//     ,[ЗаданиеТип]
//     ,[Задание]
//     ,[СотрудникТип]
//     ,[Сотрудник]
//     ,[Количество]
//     ,[Порядок]