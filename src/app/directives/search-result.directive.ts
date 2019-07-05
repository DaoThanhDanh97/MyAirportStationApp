import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appSearchResult]'
})
export class SearchResultDirective {
  @HostBinding('style.display') displayValue;

  constructor() {
    this.displayValue = 'none';
  }

  onTrigger(value: string) {
    this.displayValue = value;
  }
}
