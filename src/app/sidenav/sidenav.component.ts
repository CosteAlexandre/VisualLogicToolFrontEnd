import { Component, OnInit, Input,Inject, Output, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {MatSidenav,MatSidenavContainer,MatSidenavContent,MatDialog} from '@angular/material';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDragStart, CdkDragEnd} from '@angular/cdk/drag-drop';
import { NodesTemplateService } from '../nodes-template.service';
import {Node} from '../../models/node';
import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material';
import { NgForm } from '@angular/forms';
import {FieldBase} from '../../models/field-base';
import {DropdownField} from '../../models/field-dropdown';
import {TextboxField} from '../../models/field-textbox';

import {NodeJson} from '../../models/node-json';
import {FlowJson} from '../../models/flow-json';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor() {}



  ngOnInit() {
    
  }
 


}
