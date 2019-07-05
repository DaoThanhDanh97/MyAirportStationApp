import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  modalShowUp = new EventEmitter<string>();
  
  constructor() { }

  onModalShowUpTrigger(value: string){
    this.modalShowUp.emit(value);
  }
}
