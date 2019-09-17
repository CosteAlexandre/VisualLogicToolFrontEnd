import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogTechnology } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule,MatSelectModule, MatCheckboxModule,MatSidenavModule,MatToolbarModule,MatInputModule,MatDialogModule,MatTabsModule,MatFormFieldModule} from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import {DragDropModule } from '@angular/cdk/drag-drop';
import { DragComponent } from './drag/drag.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphComponent } from './graph/graph.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DynamicFormComponent } from './sidenav/dynamic-form/dynamic-form.component';
import { DynamicFormFieldComponent } from './sidenav/dynamic-form/dynamic-form-field/dynamic-form-field.component';
import { PaletteComponent } from './sidenav/palette/palette.component';
import { PaperComponent,DialogContentExampleDialog,DialogLogDialog } from './sidenav/paper/paper.component';
import {SocketService} from './socket.service';

@NgModule({
  declarations: [ 
    AppComponent,
    DialogTechnology,
    DialogLogDialog,
    DragComponent,
    SidenavComponent,
    DialogContentExampleDialog,
    GraphComponent,
    DynamicFormComponent,
    DynamicFormFieldComponent,
    PaletteComponent,
    PaperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatToolbarModule,
    DragDropModule,
    FormsModule,
    MatSidenavModule,
    MatSelectModule,
    MatExpansionModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    NgxGraphModule,
    NgxChartsModule,
    ReactiveFormsModule
  ],entryComponents: [
    DialogContentExampleDialog,
    DialogTechnology,
    DialogLogDialog
  ], 
  providers: [SocketService],
  bootstrap: [AppComponent],
})
export class AppModule { }
