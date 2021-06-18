import {FormControl} from '@angular/forms';

export function requiredFileType( types: string[] ): any {
  return (control: FormControl): any => {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (!types.some(type => type.toLowerCase() === extension)) { return {invalidFileExtension: extension}; }
      return null;
    }
    return null;
  };
}
