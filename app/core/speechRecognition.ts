export function speechRecognition(): Promise<string> {

    return new Promise<string>(
        (resolve: (obj?: string) => void, reject: (error: string) => void) => {
            var SpeechRecognition = (window as any).SpeechRecognition;
            var SpeechGrammarList = (window as any).SpeechGrammarList;
            var recognition = new SpeechRecognition();
            recognition.lang = "ru";
            recognition.onresult = (event: any)=> {
                if (event.results.length > 0) {
                    resolve(event.results[0][0].transcript);
                }
                else
                    reject("");
            };
            recognition.start();
        });

}
