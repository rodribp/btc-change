import {requestPrint, setConnectionMode} from "./bxlcommon";
import {printText, printQRCode, cutPaper, getPosData, setPosId, checkPrinterStatus} from './bxlpos';

function viewResult(result) {
    //p_result.value = result;
    if(result!= "")alert(result);
}

function SendTicket(){
    let date = new Date;
    PrintTicket(date,30500,2.5,300,"code url 0123181385418","Company");
}

function PrintTicket(fec,fec2,BTC,USD,SAT,QRurl, user) {

    //Datos
    
    let printName = "Printer1";
    setPosId(1);
    checkPrinterStatus();
    setConnectionMode("wss:");

    USD = Number(USD).toFixed(2); 
    let nf = new Intl.NumberFormat('en-US');
    BTC = nf.format(BTC);

    printText("\n\nBitChange\nEl Salvador Cubo+\n"+user+"\n\n", 0, 0, true, false, false, 0, 1);
    
    printQRCode("www.bitchange.site",0,1,7,0);
    printText("\nwww.bitchange.site", 0, 0, true, false, false, 0, 1);
    printText("\nTel : +503 7000-0000\n\n", 0, 0, true, false, false, 0, 0);
    
    printText("------------------------------------------\n", 0, 0, false, false, false, 0, 0);
    printText("Datos de Conversion - Data Convertion\n"     , 0, 0, true , false, false, 0, 1);
    printText("                                          \n", 0, 0, false, false, false, 0, 0);
    printText("Date:                                     \n", 0, 0, true , false, false, 0, 0);
    printText(fec+       "\n", 0, 0, false, false, false, 0, 0);				
    printText("------------------------------------------\n", 0, 0, false, false, false, 0, 0);
    printText("Monto Vuelto - Change Amount\n"                              , 0, 0, true , false, false, 0, 1);
    printText("                                          \n", 0, 0, false, false, false, 0, 0);
    printText("USD:                       "+USD+"        \n", 0, 0, false, false, false, 0, 0);
    printText("Satoshi:                 "+SAT+"          \n", 0, 0, false, false, false, 0, 0);
    printText("------------------------------------------\n", 0, 0, false, false, false, 0, 0);
    
    printText("\n\n", 0, 0, false, false, false, 0, 0);
    printText("Cambio - Change\n\n", 0, 0, true, false, false, 0, 1);
    printQRCode(QRurl,0,1,7,0);
    printText("\n\n\n\n\n", 0, 0, false, false, false, 0, 0);
    cutPaper(1);

    var strSubmit = getPosData();
    
    requestPrint(printName, strSubmit, viewResult);

    return true;
}

export {PrintTicket, SendTicket};
