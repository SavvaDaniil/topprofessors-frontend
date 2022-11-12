

export function clearSpecialSymbols(valueStr){
    if(valueStr === null)return valueStr;
    valueStr = valueStr.replace(/\n/g, "");
    valueStr = valueStr.replace(/\\n/g, "");
    valueStr = valueStr.replace(/\\r/g, "");
    //console.log(valueStr.includes("\\n"));
    return valueStr;
}
