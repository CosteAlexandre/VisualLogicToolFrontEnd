import {NodeJson} from './node-json';

export class FlowJson{
    id : string;
    listNode : NodeJson[];
    graph : string;
    infiniteFlow:boolean;
    constructor(id:string,listNode:NodeJson[],graph:string){
        this.id = id;
        this.listNode = listNode;
        this.graph = graph;
        this.infiniteFlow = false;
    }

	
}