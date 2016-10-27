import {IWorkflowConfig} from "../../interfaces/IWorkflowConfig";
import {stringAsSql} from "../../core/SqlCore";
import {DataTable} from "../../core/SqlDb";
import {executeWmsSql} from "../core/MsSqlDb";

export function алгоритм_РазмещениеПаллеты(work: IWorkflowConfig): Promise<void> {
    let ostatokSql = `
SELECT * FROM Остаток WHERE Счет=${stringAsSql(work.счет.Счет)}    
    `;

    return executeWmsSql(ostatokSql)
        .then((tables: any[])=> {
            let rows=tables[0];
            console.log(rows);
            if (rows.length>0)
                console.log(`алгоритм_РазмещениеПаллеты: есть че делать ${stringAsSql(work.счет.Счет)}`);
            else
                console.log("алгоритм_РазмещениеПаллеты: нет работы");
        })
        .catch((err: any)=> {
            console.error(err);
        });
}
