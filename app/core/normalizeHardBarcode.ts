export function normalizeHardBarcode(barcode: string): string {
    let ret: string[] = [];
    for (let i = 0; i < barcode.length; i++) {
        if (barcode.charCodeAt(i) >= 32)
            ret.push(barcode.charAt(i));
    }
    return ret.join("");
}
