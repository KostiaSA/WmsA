import {
    executeBuhtaSql, executeWmsSql, getValueFromBuhtaSql, getIsExistsWmsView,
    getIsExistsBuhtaView, getIsExistsBuhtaTable
} from "../core/MsSqlDb";
import {consoleOk, consoleError, consoleLog} from "../core/console";
import {create_proc_СоздатьЗаданиеНаПриемку} from "../config/tasks/ЗаданиеНаПриемку/create_proc_ЗаданиеНаПриемку";


//
// create_proc_СоздатьЗаданиеНаПриемку()
//      .then(()=> {
//          consoleOk("ok");
//      })
//      .catch((err: any)=> {
//          consoleError("error", err);
//      })
//
var levenshtein = require('fast-levenshtein');

function x(w1: string, w2: string) {
    var dist = levenshtein.get(w1, w2);
    console.log(w1, w2, dist);
}


export interface ICommand {
    words: string;
    number: "NONE" | "NONREQ" | "REQ";
    run?: (num?: number)=>Promise<void>;
}

export function getBestMatchCommand(commandList: ICommand[], inputText: string): ICommand | undefined {

    if (commandList.length === 0)
        return undefined;

    let inputWords = inputText.split(" ").filter((item)=>!Number.isInteger(parseInt(item)));
    let inputNumber = inputText.split(" ").filter((item)=>Number.isInteger(parseInt(item))).join("");

    let bestLev = 100000000;
    let bestCommand: ICommand | undefined = undefined;

    for (let i = 0; i < commandList.length; i++) {
        let command = commandList[i];
        let commandWords = command.words.split(" ");
        let lev = 0;

        let commandOk = true;
        if (inputWords.length !== commandWords.length)
            commandOk = false;
        if (command.number === "NONE" && inputNumber.length > 0)
            commandOk = false;
        if (command.number === "REQ" && inputNumber.length === 0)
            commandOk = false;

        if (commandOk) {
            for (let w = 0; w < inputWords.length; w++) {
                lev += levenshtein.get(commandWords[w].toLowerCase(), inputWords[w].toLowerCase());
            }

            if (lev <= 3 * inputWords.length && lev < bestLev) {
                bestLev = lev;
                bestCommand = command;
            }
        }
    }

    console.log("\n inputText: " + inputText);
    if (bestCommand === undefined)
        console.log("не опознана: " + inputText);
    else
        console.log(bestCommand.words + "\ lev=" + bestLev + "\n number=" + inputNumber+"\n\n"+inputText);

    return bestCommand;

}

export let commandList: ICommand[] = [];

commandList.push({
    words: "информация по штрих коду",
    number: "REQ"
})



getBestMatchCommand(commandList, "информация по штрих коду 333");
