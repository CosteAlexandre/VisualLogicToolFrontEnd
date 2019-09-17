import { Component, OnInit,OnDestroy, Input,Inject, Output, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {MatSidenav,MatSidenavContainer,MatSidenavContent,MatDialog} from '@angular/material';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDragStart, CdkDragEnd} from '@angular/cdk/drag-drop';
import { NodesTemplateService } from '../../nodes-template.service';
import { SocketService } from '../../socket.service';
import { SocketWbService } from '../../socket-wb.service';
import {Node} from '../../../models/node';
import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material';
import { NgForm } from '@angular/forms';
import {FieldBase} from '../../../models/field-base';
import {DropdownField} from '../../../models/field-dropdown';
import {TextboxField} from '../../../models/field-textbox';
import {GraphSharingService} from '../graph-sharing.service';
import { Observable, of} from 'rxjs';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

import {NodeJson} from '../../../models/node-json';
import {FlowJson} from '../../../models/flow-json';
import{Message} from '../../../models/message';

declare var $:JQueryStatic;
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as backbone from 'backbone';
import { AllFlowJson } from 'src/models/all-flow-json';
//const joint = require('../../../../node_modules/jointjs/dist/joint.js');
//import * as joint from 'jointjs/dist/joint.js';

const joint = require('../../../../node_modules/jointjs/dist/joint.js');
const svgPanZoom = require('svg-pan-zoom');

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.css']
})
export class PaperComponent implements OnInit {

  opened: boolean;
  name:string = '';

  graphCanvas;
  paperCanvas;

  
  listId:any= ["6"];
  selected = '';

  flow : FlowJson;
  flowInfinite:boolean = false;
  constructor(public dialog: MatDialog, private nodesTemplateService : NodesTemplateService, private graphSharingService:GraphSharingService) { }

  getGraph($event){

    this.nodesTemplateService.getFlowGraph(this.selected).subscribe(request => {
      console.log(request);
      this.graphCanvas.fromJSON(request.graph);
      this.name = request.id;
      this.selected = '';
      this.flow = request;
      this.flowInfinite = request.infiniteFlow;
    });
  }

allFLow(): void {
 
    
    this.nodesTemplateService.getAllFlow().subscribe(request => {
      this.listId =request;
      console.log(request);      
    });    
}

  ngOnInit() {
    
    this.allFLow();
    this.graphCanvas = new joint.dia.Graph;
    this.paperCanvas = new joint.dia.Paper({
      el: document.getElementById('canvas'),
      model: this.graphCanvas,
      width: '100%', 
      height: '90%',
      gridSize: 1,
//      restrictTranslate: true, 
      linkPinning: false,
      
      background: {
          color: 'rgb(211,211,211)'
      },
      defaultLink: new joint.dia.Link({
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
      }),
      
      validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) =>{

       let links = this.graphCanvas.getConnectedLinks(cellViewS.model, { outbound: true });
        
          if(magnetT === undefined){
            return false;
          }
          if(magnetT !==undefined && magnetT.getAttribute("port-group") === 'out'){
            
            return false;
          }
          if(cellViewS === cellViewT){
            return false;
          }
      
          console.log(magnetS.getAttribute("port"))
          console.log(magnetS)
          if (links.some(link => (link.get('source').port === magnetS.getAttribute("port") && link.get('target').id !==undefined) && link.get('target').id === cellViewT.model.id )) {
            
            return false;
          }

          console.log((magnetS !== magnetT))
          return (magnetS !== magnetT);
      },
  });
  ////////////////////////////////////////////////////////
//https://www.netvlies.nl/tips-updates/applicaties/cases/creating-an-interactive-svg-metro-map-with-jointjs/
//https://github.com/ariutta/svg-pan-zoom
//https://stackoverflow.com/questions/28431384/how-to-make-a-paper-draggable/35149108#35149108
    
    
    
    this.paperCanvas.on('cell:pointerdblclick', (cellView, e, x, y) => {
      console.log("double click");
      
      if(cellView.model.attributes.type === "devs.MyImageModel"){
        let node = cellView.model.attributes.attrs.info.node;            
            this.openDialog(node,cellView);            
      }

    });
    this.paperCanvas.on('cell:contextmenu', (cellView, e, x, y) => {
     // console.log(cellView);
      //, { outbound: true }

      if(cellView.model.attributes.type === 'link'){
        cellView.model.remove();
      }else{
        let links = this.graphCanvas.getConnectedLinks(cellView.model);

        links.forEach(link => {
          link.remove();
        });
        cellView.remove();
        cellView.model.remove();
      }

      
    });
    

    this.graphCanvas.on('change:source change:target', function(link) {
      if (link.get('source').id && link.get('target').id) {
         console.log('New link created');
      }
  }) 

  this.panZoom();

  this.graphSharingService.setGraphCanvas(this.graphCanvas);
  this.graphSharingService.setPaperCanvas(this.paperCanvas);



  }
  dragStartPosition;

  panZoom(){
    let svgZoom = svgPanZoom('#canvas svg', {
      center: false,
      zoomEnabled: true,
      dblClickZoomEnabled: false,
      panEnabled: true,
      controlIconsEnabled: true,
      fit: false,
      minZoom: 0.5,
      maxZoom:2,
      zoomScaleSensitivity: 0.5
    });
    
   
      this.paperCanvas.on('cell:pointerdown', ()=>{
        svgZoom.disablePan();
      });
      this.paperCanvas.on('cell:pointerup', ()=>{
        svgZoom.enablePan();
      });

  
  }
  onReset(){
    this.graphCanvas.clear();
    this.name ='';
    this.selected ='';
  }
  onChangeName(){
    this.name = "5";
  }
  onDelete(){
    let name = this.name;
    this.nodesTemplateService.deleteFlow(name).subscribe(request => {
      console.log(request);
      console.log('name : ' + name)
      const index: number = this.listId.indexOf(name);
    if (index !== -1) {
        this.listId.splice(index, 1);
    }   
     // this.listId.remove(name);
     });
  }
  onUpdate(){ 
    this.nodesTemplateService.deleteFlow(this.name).subscribe(request => {
      console.log(request);
      if(request === 'flow deleted'){
        this.onSubmit();
      } 
      
     });
  }

  createFlow(){
    let elements = this.graphCanvas.getElements();

    if(elements.length === 0 || this.name === ''){
      console.log('element name : ' + this.name === '' +' element length : '+ elements.length );
      return;
    }
    
    let i = 0;

    let nodeJsons = [];


    elements.forEach(element => {
      //console.log(element.attributes.attrs.info.node);
      let node = element.attributes.attrs.info.node;
     
      let listParameters : any;
      listParameters ={};
      listParameters['type'] = node.classType;


      if(node.type !== "MultipleOutput"){
        element.attributes.attrs.info.fields[0].forEach(element => {
       
          listParameters[element.key] =  element.value;
        });
      }else{
        listParameters['conditions'] = [];
        let list :any[];
        list = [];
        let i = 0;
        element.attributes.attrs.info.fields.forEach(element => {
          let condition = {};
          element.forEach(element => {
            condition[element.key] =  element.value;
          });
          condition['outPut'] =  i;
          list.push(condition);
          i++;
        });
        listParameters['conditions'] = list;
      }
      
      
      let outboundLinks = this.graphCanvas.getConnectedLinks(element, { outbound: true })
      let output = []; 


      
      let allOutPut = [];
      if(outboundLinks.length > 0){
        outboundLinks = outboundLinks.sort((a,b)=>a.attributes.source.port < b.attributes.source.port ? -1:1);
        
        let current = outboundLinks[0].attributes.source.port;

        outboundLinks.forEach(element => {
          let next = element.attributes.source.port;
          if(current !== next){
            current = next;
            allOutPut.push(output);
            output=[];
          }
          output.push(element.attributes.target.id);
        });
        allOutPut.push(output);
      }
      

      //constructor(id : number, funct : string, className : string, listParameters ,output : number[])
      /*
      FlowJson{

    constructor(id:number,listNode:NodeJson[]){
      */
  
      nodeJsons.push(new NodeJson(element.attributes.id,i+'',node.shortName,name,node.className,listParameters,allOutPut))

      i++;

    });
    let flowJson : FlowJson;
    let graph = this.graphCanvas.toJSON();
    flowJson = new FlowJson(this.name,nodeJsons,graph);
    return flowJson;
  }

  onSubmit(){
    let flowJson : FlowJson;
    flowJson = this.createFlow();
    console.log(flowJson); 
    
    let name = this.name;
    console.log("FLOW")
    console.log(flowJson)
    this.nodesTemplateService.addFlow(flowJson).subscribe(request => {
     console.log(request);
     if(request === 'Flow succesfully created' && !this.listId.includes(name)){
        this.flow = flowJson;
        this.flowInfinite = false;
        console.log('On sublimt : '+this.flowInfinite)
        this.listId.push(name);
     }
     this.flowInfinite = false;
     
    });
  
  }
  //https://stackblitz.com/edit/httpsstackoverflowcomquestions51806464how-to-create-and-downloa?file=src%2Fapp%2Fapp.component.ts
  onExport(){
    if(this.name === ''){
      return;
    }
    this.dyanmicDownloadByHtmlTag({
      fileName: this.name+'.json',
      text: JSON.stringify(this.createFlow())
    });
  }

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    let event = new MouseEvent("click");
    element.dispatchEvent(event);
  }


  openDialog(node : Node, cellView) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog,{
      height: '80%',
      width: '80%',
      data: {
        nodeInformation: node,
        cell : cellView,
        graph: this.graphCanvas,
        flow: this.flow,
        name:this.name,
        flowInfinite:this.flowInfinite
      }});
    console.log(`Node ${node.name} opened`);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.flowInfinite = result.flowInfinite;
    });
  }



  onLog(){
    if(this.name === '' || this.name === undefined){
      console.log('The name is undefined');
      return;
    }
    const dialogRef = this.dialog.open(DialogLogDialog, {
      height: '80%',
      width: '80%',
      data: {name: this.name},
      
    });
  }



  
}

@Component({
  selector: 'dialog-log',
  templateUrl: 'dialog-log.html',
})
export class DialogLogDialog implements OnInit,OnDestroy{

  action = Action;
  messages: string[] = [];
  messageContent: string;
  ioConnection: any;
  interval :any;
  constructor(public dialogRef: MatDialogRef<DialogLogDialog>,@Inject(MAT_DIALOG_DATA) public data: any,private socketService: SocketService,private socketWbService : SocketWbService, private nodesTemplateService : NodesTemplateService) { }
  
  
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  ngOnInit() {
    console.log("BEFORE ESTABLISHING CONNECTION");

/*
    Observable.interval(30000).subscribe(x => { // will execute every 30 seconds
      this.ionViewDidLoad();
    });
*/
this.nodesTemplateService.getFlowLog(this.data.name).subscribe(request => {
  console.log('interval '+request);  
   this.messages= request.reverse(); 

 });

this.interval = interval(5000).subscribe(x => { // will execute every 30 seconds
  console.log('5 sec');
  this.nodesTemplateService.getFlowLog(this.data.name).subscribe(request => {
    console.log('interval '+request);
    
     this.messages= request.reverse();
    
    
   });
});


    //this.initIoConnection();
   //console.log(this.sock)
    //this.socketWbService.connect('ws://localhost:8090/getFlowLog');
  }
  ngOnDestroy(){
    this.interval.unsubscribe();
    //this.socketService.disconnect();
    //this.socketWbService.close();
  }/*
  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: string[]) => {
        this.messages.push(message);
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });
      
    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }
    console.log('Asking for logs of '+this.data.name);
    this.socketService.send(new Message(this.data.name));
  }
  */


}




@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',

})
export class DialogContentExampleDialog implements OnInit{

  node : Node;
  fields : any[];

  outports: any[];
  multipleoutput : boolean;
  

  constructor(public dialogRef: MatDialogRef<DialogContentExampleDialog>,@Inject(MAT_DIALOG_DATA) public data: any,private nodesTemplateService : NodesTemplateService) { }
  
  
  ngOnInit() {
    
    this.node = this.data.nodeInformation;
       
    this.outports = this.data.cell.model.attributes.outPorts;

   // console.log(this.data.cell)
    

    if(this.node.type === "MultipleOutput"){
      this.multipleoutput = true;
      
    }
    this.fields=this.data.cell.model.attributes.attrs.info.fields;
    
       
  }
  ngOnDestroy(){
    if(this.obs !== undefined){
      this.obs.unsubscribe();
    }
    console.log('data : '+ this.data.flowInfinite)
    this.dialogRef.close({flowInfinite:this.data.flowInfinite});
  }
  obs;
  
  onTriggerApi(){
    let api = this.fields[0];
    if(api[0].value===null){
      console.log('No api enter for httpRequest');
      return ;
    }else{
      this.obs = this.nodesTemplateService.requestNode(api[0].value).subscribe(request=>{
        console.log(request)
        this.nodesTemplateService.getFlowGraph(this.data.name).subscribe(request => {
          this.data.flow = request;
          this.data.flowInfinite = request.infiniteFlow;
          console.log(' Infinite flow : '+request.infiniteFlow)
        });
      });
    }
  }
  onAddCondition(){
    let temp = _.cloneDeep(this.node.fieldBases.sort((a, b) => a.order - b.order));
    this.fields.push(temp);

    let ports = (this.data.cell.model.get('outPorts') || []).slice();
    ports.push('out'+ports.length);
    this.data.cell.model.set('outPorts', ports);
    
  }
  onDeleteCondition(field){
    const index: number = this.fields.indexOf(field);
    
    
    if (index !== -1) {
        this.fields.splice(index, 1);

        let ports = (this.data.cell.model.get('outPorts') || []).slice();
        ports.splice(-1, 1);
        this.data.cell.model.set('outPorts', ports);
    } 
    
    let graph = this.data.graph;
    let links =  graph.getConnectedLinks(this.data.cell.model)
 //   links = links.sort((a,b)=>a.attributes.source.port < b.attributes.source.port ? -1:1);
    //links.splice(index,1);
    
    for (let index = 0; index < links.length; index++) {
      links[index].remove();      
    }
    /*
    let temp = links.filter(link => (link.get('source').port === 'out'+index));
    
    temp.forEach(link => {
      link.remove(link);
    });

    
      links.forEach(link => {
        let source = link.get('source').port;
        let char = source.slice(-1);
  
        
  
        console.log(char)
      });
    
    */

    
  }
  onValidate(event){
    console.log("VALIDATED");
    event.preventDefault();
  }


}

export enum Action {
  JOINED,
  LEFT,
  RENAME
}
export enum Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect'
}