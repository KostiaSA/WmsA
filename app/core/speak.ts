
//import * as tts_ from "react-native-android-speech"
//let tts = tts_ as any;

let tts:any={};

function speak(text: string) {
    console.log(tts);
    tts.speak({
        text: text, // Mandatory
        pitch: 1.2, // Optional Parameter to set the pitch of Speech,
        forceStop: false, //  Optional Parameter if true , it will stop TTS if it is already in process
        language: "ru" // Optional Paramenter Default is en you can provide any supported lang by TTS
    }).then((isSpeaking: boolean)=> {
        //Success Callback
        console.log(isSpeaking);
    }).catch((error: any)=> {
        //Errror Callback
        console.log(error)
    });

}

let speaks: string[] = [];

export function pushSpeak(text: string) {
    // todo setOnUtteranceProgressListener - сделать перехват конца речи
    speak(text);
}

