import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  modalShowUp = new EventEmitter<string>();
  modalClose = new EventEmitter<void>();

  constructor() { }

  onModalShowUpTrigger(value: string){
    this.modalShowUp.emit(value);
  }
}
