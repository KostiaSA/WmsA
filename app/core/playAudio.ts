export function playAudio(fileName: string): Promise<void> {
    return new Promise<void>(
        (resolve: () => void, reject: (error: string) => void) => {
            var my_media = new (window as any).Media(
                "/android_asset/www/sound/" + fileName,
                ()=> {
                    resolve();
                },
                (err: any) => {
                    alert("playAudio('" + fileName + "'): error: " + err);
                    reject(err);
                }
            );
            my_media.play();
        });
}