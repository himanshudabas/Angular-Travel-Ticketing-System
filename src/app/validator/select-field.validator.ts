import {AbstractControl} from '@angular/forms';


export function SelectFieldValidator(control: AbstractControl): {[key: string]: any} | null {
  return control.value.toLowerCase() === 'dummy' ? { customSelect : true } : null;
}
