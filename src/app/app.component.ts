import { Component, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LogicPlanLogic';


  constructor(public dialog: MatDialog) {}

  openTech(): void {
    console.log("Open technologies")
    const dialogRef = this.dialog.open(DialogTechnology, {
      height: '80%',
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
 
}
@Component({
  selector: 'dialog-technology',
  templateUrl: 'dialog-technology.html',
})
export class DialogTechnology {

  constructor(public dialogRef: MatDialogRef<DialogTechnology>,@Inject(MAT_DIALOG_DATA) public data: any) { }
  

  onNoClick(): void {
    this.dialogRef.close();
  }

}