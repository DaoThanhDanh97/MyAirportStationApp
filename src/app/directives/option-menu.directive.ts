import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appOptionMenu]'
})
export class OptionMenuDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  checkNativeElement() {
    return this.elementRef.nativeElement.offsetHeight;
  }
}
