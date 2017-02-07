import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'booleanYesNo'})
export class BooleanYesNoPipe implements PipeTransform {
    transform(value) {
        return value ? 'Sim' : 'Não';
    }
}