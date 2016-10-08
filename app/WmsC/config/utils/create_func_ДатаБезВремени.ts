import {getIsExistsWmsFunc, executeWmsSql} from "../../core/MsSqlDb";
import {consoleOk, consoleError} from "../../core/console";

export function create_func_ДатаБезВремени(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsFunc("ДатаБезВремени")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";


            let sql = `
${create} FUNCTION ДатаБезВремени(
  @date DATETIME
) 
RETURNS DATETIME
AS
BEGIN
   RETURN CAST(@date AS DATE)
END
           `;
            return executeWmsSql(sql);
        })
        .then(()=> {
            consoleOk("create_func_ДатаБезВремени");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
