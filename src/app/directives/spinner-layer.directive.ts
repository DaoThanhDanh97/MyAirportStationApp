import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appSpinnerLayer]'
})
export class SpinnerLayerDirective {
  @HostBinding('style.display') displayValue: string;

  constructor() { }

  onLoadComplete() {
    this.displayValue = 'none';
  }

  onLoadStart() {
    this.displayValue = 'flex';
  }
}
