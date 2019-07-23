import { Directive, ElementRef, Renderer2, HostBinding } from '@angular/core';

@Directive({
  selector: '[appMetar24hWindDegree]'
})
export class Metar24hWindDegreeDirective {
  @HostBinding('style.top') topValue: string;
  @HostBinding('style.left') leftValue: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { 
    this.topValue = '200px';
    this.leftValue = '200px';
  }

  getResult(result: any) {
    this.topValue = (result.top + 52) + "px";
    this.leftValue = (result.left - 12) + "px";
  }
}
