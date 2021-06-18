import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: FileUploadComponent,
    multi: true
  }],
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements ControlValueAccessor {
  // tslint:disable-next-line:ban-types
  onChange: Function;
  public file: File | null = null;

  // tslint:disable-next-line:typedef
  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
  }

  constructor(
    private host: ElementRef<HTMLInputElement>
  ){}

  writeValue( value: null ): void {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  // tslint:disable-next-line:ban-types
  registerOnChange( fn: Function ): void {
    this.onChange = fn;
  }

  // tslint:disable-next-line:ban-types
  registerOnTouched( fn: Function ): void {
  }

}
