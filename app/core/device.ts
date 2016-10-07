export let testedDevices: IDevice[] = [];

export interface IDevice {
    model: string;
    android: string;
    speak: boolean;  // говорилка
    voice: boolean;  // распознавание голоса
    barcode: "camera" | "CipherRS30";
}

export function getDevice(): IDevice {
    let ret=testedDevices.filter((item:IDevice)=>item.model===(window as any).device.model && item.android===(window as any).device.version)[0];
    if (ret===undefined)
    {
        alert(`
Модель не сертифицирована 
для Бухта WMS:

brand: ${(window as any).device.manufacturer} 
model: ${(window as any).device.model} 
android: ${(window as any).device.version}
`);
    }
    return ret;
}


testedDevices.push({
    model: "CipherLab RS30",
    android: "4.4.2",
    speak: false,
    voice: false,
    barcode: "CipherRS30"
});

testedDevices.push({
    model: "Redmi 3S",
    android: "6.0.1",
    speak: true,
    voice: true,
    barcode: "camera"
});

