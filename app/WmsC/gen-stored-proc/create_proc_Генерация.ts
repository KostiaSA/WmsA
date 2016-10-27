import {ITaskConfig, ITaskSpecConfig} from "../../interfaces/ITaskConfig";
import {getIsExistsWmsProc, executeWmsSql} from "../core/MsSqlDb";
import {replaceAll} from "../../core/replaceAll";
import {consoleOk, consoleError} from "../core/console";
import {emitFieldList, emitFieldList_forWhereSql} from "../core/emit";
import {
    I_Генерация, ГенМесто, ГенОбъект, ГенДоговор, ГенСотрудник, ГенЗадание,
    ГенКоличество
} from "../../interfaces/I_Генерация";
import {stringAsSql} from "../../core/SqlCore";
import {I_Регистр} from "../../interfaces/I_Регистр";
import {ISubcontoType} from "../../common/registerSubcontoType";
import {Субконто_Договор, Субконто_Сотрудник, Субконто_Задание, Субконто_Нет} from "../../common/Buhta";


export function create_proc_Генерация(task: ITaskConfig, spec: ITaskSpecConfig): Promise<void> {

    let proc_name = "Генерация_" + replaceAll(task.taskName, " ", "_") + "___" + replaceAll(spec.taskSpecName, " ", "_");

    let create = "CREATE";

    return getIsExistsWmsProc(proc_name)
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let gens = spec.generates.map((gen: I_Генерация)=> {
                return emitOneGen(task, spec, gen);
            });

            let sql = `
-- эта процедура сгенерирована автоматически, не изменяйте ее            
${create} PROCEDURE ${proc_name}(
  @задание int,
  @сотрудник int,
  @договорТип VARCHAR(3) = 'Нет',
  @договор int = 0,
  @откудаТип VARCHAR(3) = 'Нет',
  @откуда int = 0,
  @кудаТип VARCHAR(3) = 'Нет',
  @куда int = 0,
  @объектТип VARCHAR(3) = 'Нет',
  @объект int = 0,
  
  @fake int =0
) AS
BEGIN
  BEGIN TRAN
  
  DECLARE @время DATETIME=GETDATE()
  DECLARE @дата DATE=dbo.ДатаБезВремени(@время)
  ${gens.join("\n")}
  SELECT 'Ok'
  COMMIT
  
END
            `;
            return executeWmsSql(sql);
        })
        .then(()=> {
            consoleOk(`create_proc_${proc_name}`);
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}

function emitOneGen(task: ITaskConfig, spec: ITaskSpecConfig, gen: I_Генерация): string {

    let pushMestoField = (fields: any[], genMesto: ГенМесто | undefined, genSchet: I_Регистр, prefix: "Дб" | "Кр" | "") => {
        if (genMesto !== undefined) {
            if (genMesto === ГенМесто.Нет) {
                if (genSchet.МестоТипы.filter((item: ISubcontoType)=>item.type === Субконто_Нет.type).length === 0)
                    throw "тип субконото 'Нет' недопустим у 'места' в регистре '" + genSchet.Счет + "'";
                fields.push([prefix + "МестоТип", stringAsSql(Субконто_Нет.type)]);
                fields.push([prefix + "Место", 0]);
            }
            else if (genMesto === ГенМесто.ПаллетаКуда) {
                fields.push([prefix + "МестоТип", "@кудаТип"]);
                fields.push([prefix + "Место", "@куда"]);
            }
            else if (genMesto === ГенМесто.ПаллетаОткуда) {
                fields.push([prefix + "МестоТип", "@откудаТип"]);
                fields.push([prefix + "Место", "@откуда"]);
            }
            else
                throw "неизвестное 'ГенМесто': " + genMesto;
        }
    };

    let pushObjectField = (fields: any[], genObject: ГенОбъект | undefined, genSchet: I_Регистр, prefix: "Дб" | "Кр" | "") => {
        if (genObject !== undefined) {
            if (genObject === ГенОбъект.Нет) {
                if (genSchet.ОбъектТипы.filter((item: ISubcontoType)=>item.type === Субконто_Нет.type).length === 0)
                    throw "тип субконото 'Нет' недопустим у 'объекта' в регистре '" + genSchet.Счет + "'";
                fields.push([prefix + "ОбъектТип", stringAsSql("Нет")]);
                fields.push([prefix + "Объект", 0]);
            }
            else if (genObject === ГенОбъект.ОбъектШтрихКода) {
                fields.push([prefix + "ОбъектТип", "@объектТип"]);
                fields.push([prefix + "Объект", "@объект"]);
            }
            else
                throw "неизвестный 'ГенОбъект': " + genObject;
        }
    };

    let pushDogField = (fields: any[], genDog: ГенДоговор | undefined, genSchet: I_Регистр, prefix: "Дб" | "Кр" | "") => {
        if (genDog !== undefined) {
            if (genDog === ГенДоговор.Нет) {
                if (genSchet.ДоговорПриходаТипы.filter((item: ISubcontoType)=>item.type === Субконто_Нет.type).length === 0)
                    throw "тип субконото 'Нет' недопустим у 'Договора' в регистре '" + genSchet.Счет + "'";
                fields.push([prefix + "ДоговорТип", stringAsSql(Субконто_Нет.type)]);
                fields.push([prefix + "Договор", 0]);
            }
            else if (genDog === ГенДоговор.Договор) {
                fields.push([prefix + "ДоговорТип", "@договорТип"]);
                fields.push([prefix + "Договор", "@договор"]);
            }
            else
                throw "неизвестный 'ГенДоговор': " + genDog;
        }
    };

    let pushUserField = (fields: any[], genUser: ГенСотрудник | undefined, genSchet: I_Регистр, prefix: "Дб" | "Кр" | "") => {
        if (genUser !== undefined) {
            if (genUser === ГенСотрудник.Нет) {
                if (genSchet.СотрудникТипы.filter((item: ISubcontoType)=>item.type === Субконто_Нет.type).length === 0)
                    throw "тип субконото 'Нет' недопустим у 'Сотрудника' в регистре '" + genSchet.Счет + "'";
                fields.push([prefix + "СотрудникТип", stringAsSql(Субконто_Нет.type)]);
                fields.push([prefix + "Сотрудник", 0]);
            }
            else if (genUser === ГенСотрудник.Сотрудник) {
                fields.push([prefix + "СотрудникТип", stringAsSql(Субконто_Сотрудник.type)]);
                fields.push([prefix + "Сотрудник", "@Сотрудник"]);
            }
            else
                throw "неизвестный 'ГенСотрудник': " + genUser;
        }
    };

    let pushTaskField = (fields: any[], genTask: ГенЗадание | undefined, genSchet: I_Регистр, prefix: "Дб" | "Кр" | "") => {
        if (genTask !== undefined) {
            if (genTask === ГенЗадание.Нет) {
                if (genSchet.ЗаданиеТипы.filter((item: ISubcontoType)=>item.type === Субконто_Нет.type).length === 0)
                    throw "тип субконото 'Нет' недопустим у 'Задания' в регистре '" + genSchet.Счет + "'";
                fields.push([prefix + "ЗаданиеТип", stringAsSql(Субконто_Нет.type)]);
                fields.push([prefix + "Задание", 0]);
            }
            else if (genTask === ГенЗадание.Задание) {
                fields.push([prefix + "ЗаданиеТип", stringAsSql(Субконто_Задание.type)]);
                fields.push([prefix + "Задание", "@Задание"]);
            }
            else
                throw "неизвестное 'ГенЗадание': " + genTask;
        }
    };

    let pushKolField = (fields: any[], genKol: ГенКоличество | undefined, genSchet: I_Регистр, prefix: "Дб" | "Кр" | "") => {
        if (genKol !== undefined) {
            if (genKol === ГенКоличество.Нет) {
                if (genSchet.Количество === true)
                    throw "'Количество' должно быть заполнено в регистре '" + genSchet.Счет + "'";
                fields.push([prefix + "Количество", 0]);
            }
            else if (genKol === ГенКоличество.Единица) {
                if (genSchet.Количество === false)
                    throw "'Количество' не должно быть заполнено в регистре '" + genSchet.Счет + "'";
                fields.push([prefix + "Количество", 1]);
            }
            else if (genKol === ГенКоличество.КоличествоШтрихКода) {
                if (genSchet.Количество === false)
                    throw "'Количество' не должно быть заполнено в регистре '" + genSchet.Счет + "'";
                // todo КоличествоШтрихКода надо взять из таблицы штрих-кодов
                fields.push([prefix + "Количество", 1]);
            }
            else
                throw "неизвестное 'ГенКоличество': " + genKol;
        }
    };

    let pushFields = (fields: any[], prefix: "Дб" | "Кр" | "") => {
        let genDbKr = gen.Кредит;
        if (prefix === "Дб")
            genDbKr = gen.Дебет;

        if (genDbKr !== undefined) {
            fields.push([prefix + "Счет", stringAsSql(genDbKr.Счет.Счет)]);
            pushMestoField(fields, genDbKr.Место, genDbKr.Счет, prefix);
            pushObjectField(fields, genDbKr.Объект, genDbKr.Счет, prefix);
            pushDogField(fields, genDbKr.Договор, genDbKr.Счет, prefix);
            pushTaskField(fields, genDbKr.Задание, genDbKr.Счет, prefix);
            pushUserField(fields, genDbKr.Сотрудник, genDbKr.Счет, prefix);
            pushKolField(fields, genDbKr.Количество, genDbKr.Счет, prefix);
        }
    };


    let specFields = [
        ["ДокспецВид", task.документВид * 1000 + gen.ДокспецВид],
        ["Дата", "@дата"],
        ["Время", "@время"],
        ["Задание", "@задание"],
        ["Сотрудник", "@сотрудник"],

        // ["ДбКоличество", "ЗаявкаНаПриходСпец.Количество"],
    ];

    pushFields(specFields, "Кр");
    pushFields(specFields, "Дб");

    let check_ostatok_sql = "";
    if (gen.Кредит !== undefined) {
        let ostFields = []
        pushFields(ostFields, "");

        let ostKolField=ostFields.slice(-1)[0];

        check_ostatok_sql = `
  IF NOT EXISTS(SELECT '*' FROM Остаток WHERE ${ emitFieldList_forWhereSql(ostFields.slice(0,ostFields.length-2))} AND ${ostKolField[0]}>=${ostKolField[1]})
  BEGIN
    SELECT 'Ошибка нет остатка на счете "${gen.Кредит.Счет.Счет}"'
    ROLLBACK
    RETURN
  END
  `;
    }

    let sql = `
${check_ostatok_sql}    
  INSERT ЗаданиеСпец (${ emitFieldList(specFields, "target")})
  SELECT ${ emitFieldList(specFields, "source")}
    `;

    return sql;
}
