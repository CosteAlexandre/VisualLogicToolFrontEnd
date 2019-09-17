import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GraphSharingService {

  private graphCanvas;
  private paperCanvas;

  private graphCanvasBehavior  = new BehaviorSubject<any>("graph canvas");
  private paperCanvasBehavior = new BehaviorSubject<any>("graph canvas");;

  graphCanvasObs = this.graphCanvasBehavior.asObservable();;
  paperCanvasObs = this.paperCanvasBehavior.asObservable();;

  constructor() { 

   

  }


  setGraphCanvas(graphCanvas){
    this.graphCanvas = graphCanvas;
    this.graphCanvasBehavior.next(graphCanvas);
    
  }
  setPaperCanvas(paperCanvas){
    this.paperCanvas = paperCanvas;
    this.paperCanvasBehavior.next(paperCanvas);
  }

}
