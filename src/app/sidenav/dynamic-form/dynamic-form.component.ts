import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';

import { FieldBase }              from '../../../models/field-base';
import { FieldControlService }    from './field-control.service';
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  providers: [ FieldControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() fields: FieldBase<any>[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private qcs: FieldControlService) {  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.fields);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
    this.fields.forEach(field => {
      field.value = this.form.get(field.key).value;

    });
  }
}
