import { Component, OnInit, Input } from '@angular/core';
import { NodesTemplateService } from '../../nodes-template.service';
import {Node} from '../../../models/node';
import {Type} from '../../../models/type';

import {GraphSharingService} from '../graph-sharing.service';

declare var $:JQueryStatic;
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as backbone from 'backbone';
import { type } from 'os';
import { nodeChildrenAsMap } from '@angular/router/src/utils/tree';
//const joint = require('../../../../node_modules/jointjs/dist/joint.js');
//import * as joint from 'jointjs/dist/joint.js';

const joint = require('../../../../node_modules/jointjs/dist/joint.js');


@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
})
export class PaletteComponent implements OnInit {
  nodes : Node[];
  listRect : any[];

  graphCanvas;
  paperCanvas;
  constructor(private nodesTemplateService : NodesTemplateService,private graphSharingService:GraphSharingService) { }

  ngOnInit() {
    

    joint.shapes.devs.MyImageModel = joint.shapes.devs.Model.extend({

      markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
    
      defaults: joint.util.deepSupplement({
    
          type: 'devs.MyImageModel',
          size: { width: 70, height: 50 },
          attrs: {
              '.port-body': {
                  r: 5,
                  magnet: true,
                  stroke: '#000000'
              },
    //            rect: { stroke: '#d1d1d1', fill: { type: 'linearGradient', stops: [{offset: '0%', color: 'white'}, {offset: '50%', color: '#d1d1d1'}], attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' } } },
    //            circle: { stroke: 'gray' },
              '.inPorts circle': { fill: '' },
              '.outPorts circle': { fill: '' },
              image: {  width: 70, height: 20, 'ref-x': .5, 'ref-y': .69, ref: 'rect', 'x-alignment': 'middle', 'y-alignment': 'middle' }
          }
    
      }, joint.shapes.devs.Model.prototype.defaults)
    });
    joint.shapes.devs.MyImageModelView = joint.shapes.devs.ModelView;


    this.getNodes();
    this.graphSharingService.graphCanvasObs.subscribe(graphCanvas => this.graphCanvas = graphCanvas);
    this.graphSharingService.paperCanvasObs.subscribe(paperCanvas => this.paperCanvas = paperCanvas);
  }

  initializePanel(elementId:string,nodes:Node[]) {
    let sizeNode = 60 * nodes.length;
    let graph = new joint.dia.Graph;
    let paper = new joint.dia.Paper({
        el: document.getElementById(elementId),
        model: graph,
        width: '250',
        height: sizeNode,
        gridSize: 1,
        interactive: false,
        background: {
            color: '#fff'
        }
    });

    let listRect = [];
    let y = 0;
  
    for (let node of nodes) {

      let inPort = ['in'];
      let outPort= ['out'];

      if(node.type === "InputNode"){
        inPort = [];
      }
      if(node.type === "OutputNode"){
        outPort = [];
      }
      if(node.type === "TwoOutPut"){
        outPort.push('out1');
      }
///////////////////////////////////
/*

joint.shapes.devs.MyImageModel = joint.shapes.devs.Model.extend({

  markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',

  defaults: joint.util.deepSupplement({

      type: 'devs.MyImageModel',
      size: { width: 70, height: 50 },
      attrs: {
          '.port-body': {
              r: 5,
              magnet: true,
              stroke: '#000000'
          },
//            rect: { stroke: '#d1d1d1', fill: { type: 'linearGradient', stops: [{offset: '0%', color: 'white'}, {offset: '50%', color: '#d1d1d1'}], attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' } } },
//            circle: { stroke: 'gray' },
          '.inPorts circle': { fill: '' },
          '.outPorts circle': { fill: '' },
          image: {  width: 70, height: 20, 'ref-x': .5, 'ref-y': .69, ref: 'rect', 'x-alignment': 'middle', 'y-alignment': 'middle' }
      }

  }, joint.shapes.devs.Model.prototype.defaults)
});
joint.shapes.devs.MyImageModelView = joint.shapes.devs.ModelView;
*/
/*
joint.imageToDataUri('/image/test.png',()=>{
  console.log("callback");
});
*/
let rect = new joint.shapes.devs.MyImageModel({
  inPorts: inPort,
  outPorts: outPort,
  ports: {
      groups: {
          'in': {
              attrs: {
                  '.port-body': {
                      fill: '#16A085',
                      magnet: 'passive'
                  }
              }
          },
          'out': {
              attrs: {
                  '.port-body': {
                      fill: '#E74C3C'
                  }
              }
          }
      }
  },
  attrs: { 
    //image: { "src" : "/assets/test.png" } 
    //https://image.shutterstock.com/z/stock-vector-check-box-granite-icons-a-professional-pixel-perfect-icon-designed-on-a-x-pixel-grid-and-702058555.jpg
   // image:{"xlink:href" : "https://image.shutterstock.com/image-vector/wooden-stump-16x16-pixel-art-260nw-1116401501.jpg"}
    image:{"xlink:href" : node.imageUrl}
  }
});
//////////////////////////////////
/*
      var rect = new joint.shapes.devs.Model({
        inPorts: inPort,
        outPorts: outPort,
        ports: {
            groups: {
                'in': {
                    attrs: {
                        '.port-body': {
                            fill: '#16A085',
                            magnet: 'passive'
                        }
                    }
                },
                'out': {
                    attrs: {
                        '.port-body': {
                            fill: '#E74C3C'
                        }
                    }
                }
            }
        }
    });*/
      $('#modelCanvas').width();
      rect.position(58, y);
      rect.resize(120, 60);
      rect.attr({
        rect: {
              fill: node.color
          },
          text: { text: node.name},
          info:{
            type: node.name,
            node : node,
            fields : [node.fieldBases]
          }
      });
     
     // console.log(rect.attributes.attrs.info.fields.sort((a, b) => a.order - b.order))
      rect.attributes.attrs.info.fields = rect.attributes.attrs.info.fields.sort((a, b) => a.order - b.order);
      listRect.push(rect);
      rect.addTo(graph);
      y+=60;
    }

    paper.on('cell:pointerdown',(cellView, e, x, y)=>{
  

      $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>');
      let flyGraph = new joint.dia.Graph,
        flyPaper = new joint.dia.Paper({
          el: $('#flyPaper'),
          model: flyGraph,
          interactive: false,
          width: '120',
          height: '60'
        }),
        flyShape = cellView.model.clone(),
        pos = cellView.model.position(),
        offset = {
          x: x - pos.x,
          y: y - pos.y
        };
        
      flyShape.position(0, 0);
      flyGraph.addCell(flyShape);
      $("#flyPaper").offset({
        left: e.pageX - offset.x,
        top: e.pageY - offset.y
      });
      $('body').on('mousemove.fly', (e) => {
        $("#flyPaper").offset({
          left: e.pageX - offset.x,
          top: e.pageY - offset.y
        });
      });
      $('body').on('mouseup.fly', (e) => {
        let x = e.pageX,
          y = e.pageY,
          target = this.paperCanvas.$el.offset();          
         // let position = e.getBoundingClientRect()
     
        // Dropped over paper ?
        if (x > target.left && x < target.left + this.paperCanvas.$el.width() && y > target.top && y < target.top + this.paperCanvas.$el.height()) {
          let s = flyShape.clone();
          s.position(x - target.left - offset.x, y - target.top - offset.y);
          
          
    
         /* var shortname = s.attributes.attrs.info.node.shortName;
          s.set('id',shortname+' - '+s.get('id'))*/
          this.graphCanvas.addCell(s);
        }
        $('body').off('mousemove.fly').off('mouseup.fly');
        flyShape.remove();
        $('#flyPaper').remove();
      });
     });

  }

  getNodes(): void {
    this.nodesTemplateService.getNodes()
      .subscribe(request => {
        this.nodes = request;
        console.log(request)
        //this.initializePaper();
        this.addTypes();
      });
  }
  nodeInformation = {};
  addTypes(){
  /*  for (let index = 0; index < 30; index++) {
      var temp = Object.assign({}, this.nodes[0]); 
      temp.type = ''+index;
      this.nodes.push(temp)
      
    }*/
    this.nodes.forEach(node => {
      
      if(this.nodeInformation[node.type] === undefined){
        this.nodeInformation[node.type] = new Type(node.type,node.labelType);
        this.nodeTypes.push(this.nodeInformation[node.type]);
      } 
      this.nodeInformation[node.type].nodes.push(node);
    });

  } 
  nodeTypes= [];
  openGroup(type){
    this.initializePanel(type.type,this.nodeInformation[type.type].nodes)
  }
}

/* <mat-accordion> </mat-accordion> */