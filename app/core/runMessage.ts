import {IMessage} from "../interfaces/IMessage";
import {IMessageParams} from "../interfaces/IMessageParams";
import {pushSpeak} from "./speak";
import {showToast} from "./toast";
import {playAudio} from "./playAudio";


export let lastMessage: IMessage | undefined;
export let lastParams: IMessageParams | undefined;

export function runLastMessage() {
    if (lastMessage !== undefined)
        runMessage(lastMessage, lastParams);
}

export function runMessage(message: IMessage, params?: IMessageParams) {
    lastMessage = message;
    lastParams = params;

    if (params !== undefined) {
        if (params.p1 !== undefined) {
            if (message.sound !== undefined)
                message.sound = message.sound.replace("%1", params.p1);
            if (message.voice !== undefined)
                message.voice = message.voice.replace("%1", params.p1);
            if (message.toast !== undefined)
                message.toast = message.toast.replace("%1", params.p1);
        }
        if (params.p2 !== undefined) {
            if (message.sound !== undefined)
                message.sound = message.sound.replace("%2", params.p2);
            if (message.voice !== undefined)
                message.voice = message.voice.replace("%2", params.p2);
            if (message.toast !== undefined)
                message.toast = message.toast.replace("%2", params.p2);
        }
        if (params.p3 !== undefined) {
            if (message.sound !== undefined)
                message.sound = message.sound.replace("%3", params.p3);
            if (message.voice !== undefined)
                message.voice = message.voice.replace("%3", params.p3);
            if (message.toast !== undefined)
                message.toast = message.toast.replace("%3", params.p3);
        }
    }

    if (message.toast !== undefined) {
        showToast(message.toast);
    }

    if (message.sound !== undefined && message.voice !== undefined) {
        playAudio(message.sound)
            .then(()=> {
                pushSpeak(message.voice!);
            });
    }
    else if (message.sound !== undefined) {
        playAudio(message.sound);
    }
    else if (message.voice !== undefined) {
        pushSpeak(message.voice);
    }
}
