import {registerSubconto} from "./registerSubcontoType";

export let Бухта_ЮрЛицо: number = 1;

export let ВидДокумента_ЗаданиеНаПриемку: number = 10000;
export let ВидДокспец_ЗаданиеНаПриемТовара: number = 1;
export let ВидДокспец_ПриемТовара: number = 2;
export let ВидДокспец_ВзятьПаллетуВЗадание: number = 3;
export let ВидДокспец_ВзятьКоробкуВЗадание: number = 4;

export let ВидДокумента_НовыеПаллеты: number = 10001;
export let ВидДокспец_НоваяПаллета: number = 1;


export let Субконто_Задание = {type: "Док", tableName: "Задание"}
export let Субконто_Паллета = {type: "PAL", tableName: "Паллета"};
export let Субконто_Коробка = {type: "BOX", tableName: "Коробка"};
export let Субконто_Товар = {type: "ТМЦ", tableName: "Товар"};
export let Субконто_Ячейка = {type: "CEL", tableName: "Ячейка"};

registerSubconto(Субконто_Задание);
registerSubconto(Субконто_Паллета);
registerSubconto(Субконто_Коробка);
registerSubconto(Субконто_Товар);
registerSubconto(Субконто_Ячейка);
