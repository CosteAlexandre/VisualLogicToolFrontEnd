import {Field} from './field';
import {FieldBase} from './field-base';

export class Node{
	name : string;
	tooltip : string;
	description : string;
	type : string;
	labelType : string;
	fields : Field[];
	fieldBases : FieldBase<any>[];
//fieldBases : [FieldBase<any>[]];
	className : string;
	classType : string;

	shortName : string;

	color : string;

	imageUrl : string;
}