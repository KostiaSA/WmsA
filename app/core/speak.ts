import {getDevice} from "./device";

function speak(text: string) {
    let tts: any = window["TTS" as any] as any;

    tts.speak({
        text: text,
        locale: 'ru-RU',
        rate: 1.5
    }, function () {
        //alert('success');
    }, function (reason: any) {
        alert(reason);
    });

}

let speaks: string[] = [];

export function pushSpeak(text: string) {
    if (getDevice().speak)
        speak(text);
}
