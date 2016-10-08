import {
    executeBuhtaSql, executeWmsSql, getValueFromBuhtaSql, getIsExistsWmsView,
    getIsExistsBuhtaView, getIsExistsBuhtaTable
} from "../core/MsSqlDb";
import {consoleOk, consoleError, consoleLog} from "../core/console";
import {create_func_ДатаБезВремени} from "../config/utils/create_func_ДатаБезВремени";
import {create_func_СубконтоНомерНазвание} from "../config/utils/create_func_СубконтоНомерНазвание";
import {create_proc_ПолучитьСубконтоПоШтрихКоду} from "../config/utils/create_proc_ПолучитьСубконтоПоШтрихКоду";
import {loadWmsConfigApp} from "../loadWmsConfigApp";
import {fill_table_ШтрихКод} from "../config/tables/ШтрихКод";

loadWmsConfigApp();

fill_table_ШтрихКод()
    .catch((err: any)=> {
        consoleError("fill_table_ШтрихКод", err);
        process.exit();
    })

