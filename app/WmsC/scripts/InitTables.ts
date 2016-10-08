import {
    executeBuhtaSql, executeWmsSql, getValueFromBuhtaSql, getIsExistsWmsView,
    getIsExistsBuhtaView, getIsExistsBuhtaTable
} from "../core/MsSqlDb";
import {consoleOk, consoleError, consoleLog} from "../core/console";
import {init_table_Задание} from "../config/tables/Задание";
import {init_table_ЗаданиеСпец} from "../config/tables/ЗаданиеСпец";
import {init_table_Товар} from "../config/tables/Товар";
import {init_table_Паллета, create_proc_Перевод_свободных_паллет_в_новые} from "../config/tables/Паллета";
import {init_table_Ячейка} from "../config/tables/Ячейка";
import {init_table_ЗаявкаНаПриход} from "../config/tables/ЗаявкаНаПриход";
import {init_table_ЗаявкаНаПриходСпец} from "../config/tables/ЗаявкаНаПриходСпец";
import {
    create_table_Остаток, init_table_Остаток, create_trigger_Докспец_wms_Остаток,
    create_proc_Пересоставить_Остаток
} from "../config/tables/Остаток";
import {loadWmsConfigApp} from "../loadWmsConfigApp";
import {create_table_ШтрихКод} from "../config/tables/ШтрихКод";

loadWmsConfigApp();

init_table_Задание()
    .then(()=>{
        return init_table_ЗаданиеСпец();
    })
    .then(()=>{
        return init_table_Товар();
    })
    .then(()=>{
        return init_table_Паллета();
    })
    .then(()=>{
        return create_proc_Перевод_свободных_паллет_в_новые();
    })
    .then(()=>{
        return init_table_Ячейка();
    })
    .then(()=>{
        return init_table_ЗаявкаНаПриход();
    })
    .then(()=>{
        return init_table_ЗаявкаНаПриходСпец();
    })
    .then(()=>{
        return create_table_Остаток();
    })
    .then(()=>{
        return init_table_Остаток();
    })
    .then(()=>{
        return create_trigger_Докспец_wms_Остаток();
    })
    .then(()=>{
        return create_proc_Пересоставить_Остаток();
    })
    .then(()=>{
        return create_table_ШтрихКод();
    })
    .then(()=>{
        console.log("\n");
        consoleOk("init-tables","Ok")
        process.exit();
    })
    .catch((err: any)=> {
        consoleError("init-tables-error", err);
        process.exit();
    })

