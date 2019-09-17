export class NodeJson{
    id : string;
    logId : string;
    shortName : string;
    function : string;
    className : string;
    listParameters : any[];
    output : any[]; 
    
    
    constructor(id : string, logId : string, shortName : string, funct : string, className : string, listParameters : any[],output : any[]){
        this.id =id;
        this.logId = logId;
        this.shortName = shortName;
        this.function = funct;
        this.className = className;
        this.listParameters = listParameters;
        this.output = output;
    } 


}