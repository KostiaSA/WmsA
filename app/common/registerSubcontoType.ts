export let SubcontoList: ISubcontoType[] = [];

export interface ISubcontoType {
    type: string;
    tableName: string;
}

export function registerSubconto(subconto: ISubcontoType) {
    if (SubcontoList.filter((item)=>item.type === subconto.type).length > 0)
        throw "registerSubconto(): уже субконто с типом '" + subconto.type + "'";
    SubcontoList.push(subconto);
}


// export function registerAllSubcontos() {
//     registerSubconto({type: "Док", tableName: "Задание"});
//     registerSubconto({type: "PAL", tableName: "Паллета"});
//     registerSubconto({type: "ТМЦ", tableName: "Товар"});
//     registerSubconto({type: "CEL", tableName: "Ячейка"});
//
// }
