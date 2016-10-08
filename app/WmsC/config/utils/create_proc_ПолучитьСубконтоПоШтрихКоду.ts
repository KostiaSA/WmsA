import {getIsExistsWmsFunc, executeWmsSql, getIsExistsWmsProc} from "../../core/MsSqlDb";
import {consoleOk, consoleError} from "../../core/console";

export function create_proc_ПолучитьСубконтоПоШтрихКоду(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsProc("ПолучитьСубконтоПоШтрихКоду")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";


            let sql = `
${create} PROCEDURE ПолучитьСубконтоПоШтрихКоду(
  @barcode VARCHAR(MAX)
) 
AS
BEGIN
   SELECT 'ТМЦ' СубконтоТип, 100 Субконто   
END
           `;
            return executeWmsSql(sql);
        })
        .then(()=> {
            consoleOk("create_proc_ПолучитьСубконтоПоШтрихКоду");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
