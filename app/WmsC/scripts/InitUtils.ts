import {
    executeBuhtaSql, executeWmsSql, getValueFromBuhtaSql, getIsExistsWmsView,
    getIsExistsBuhtaView, getIsExistsBuhtaTable
} from "../core/MsSqlDb";
import {consoleOk, consoleError, consoleLog} from "../core/console";
import {create_func_ДатаБезВремени} from "../config/utils/create_func_ДатаБезВремени";
import {create_func_СубконтоНомерНазвание} from "../config/utils/create_func_СубконтоНомерНазвание";
import {create_proc_ПолучитьСубконтоПоШтрихКоду} from "../config/utils/create_proc_ПолучитьСубконтоПоШтрихКоду";
import {loadWmsConfigApp} from "../loadWmsConfigApp";
import {create_func_СубконтоХранитКоличество} from "../config/utils/create_func_СубконтоХранитКоличество";
import {create_proc_СоздатьЗаданиеНаПриемку} from "../config/tasks/ЗаданиеНаПриемку/create_proc_ЗаданиеНаПриемку";


loadWmsConfigApp();

create_func_ДатаБезВремени()
    .then(()=> {
        return create_func_СубконтоНомерНазвание("Номер");
    })
    .then(()=> {
        return create_func_СубконтоНомерНазвание("Название");
    })
    .then(()=> {
        return create_func_СубконтоНомерНазвание("НомерНазвание");
    })
    .then(()=> {
        return create_func_СубконтоХранитКоличество();
    })
    .then(()=> {
        return create_proc_ПолучитьСубконтоПоШтрихКоду();
    })
    .then(()=> {
        return create_proc_СоздатьЗаданиеНаПриемку();
    })
    .then(()=> {
        console.log("\n");
        consoleOk("init-utils", "Ok")
        process.exit();
    })
    .catch((err: any)=> {
        consoleError("init-utils-error", err);
        process.exit();
    })

