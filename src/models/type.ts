import {Node} from './node';

export class Type{
	type : string;
	typeLabel : string;
    nodes : Node[];
    
    constructor(type:string,typeLabel:string){
        this.type = type;
        this.typeLabel = typeLabel;
        this.nodes = [];
    }


}