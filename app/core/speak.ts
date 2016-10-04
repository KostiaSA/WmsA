//import * as tts_ from "react-native-android-speech"
//let tts = tts_ as any;


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
    // console.log(tts);
    // tts.speak({
    //     text: text,
    //     rate: 1.5,
    //     locale: 'ru-RU'
    // }).then((isSpeaking: boolean)=> {
    //     //Success Callback
    //     console.log(isSpeaking);
    // }).catch((error: any)=> {
    //     //Errror Callback
    //     console.log(error)
    // });

}

let speaks: string[] = [];

export function pushSpeak(text: string) {
    // todo setOnUtteranceProgressListener - сделать перехват конца речи
    speak(text);
}

// (window["TTS" as any] as any)
//     .speak({
//         text: 'Р’С‹ СЃР»СѓС€Р°РµС‚Рµ СЃРёРЅС‚РµР· СЂРµС‡Рё РЅР° СЂСѓСЃСЃРєРѕРј СЏР·С‹РєРµ',
//         locale: 'ru-RU',
//         rate: 0.75
//     }, function () {
//         //alert('success');
//     }, function (reason: any) {
//         alert(reason);
//     });