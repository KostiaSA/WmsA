
import {ISubcontoType} from "../common/registerSubcontoType";
import {Субконто_Паллета, Субконто_Товар} from "../common/Buhta";

export interface IDeveloperModeBarcode{
    type:ISubcontoType;
    barcode:string;
}

export function getDeveloperMode():boolean{
    return true;
}

export let developerModeBarcodes:IDeveloperModeBarcode[]=[
    {type: Субконто_Паллета, barcode:"PAL042151"},
    {type: Субконто_Паллета, barcode:"PAL042162"},
    {type: Субконто_Паллета, barcode:"PAL042171"},
    {type: Субконто_Паллета, barcode:"PAL042183"},

    {type: Субконто_Товар, barcode:"2000000818115"},
    {type: Субконто_Товар, barcode:"2000000827209"},
    {type: Субконто_Товар, barcode:"2000000857442"},
]

