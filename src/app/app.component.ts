import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal-service.service';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DashboardService]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'my-airport-app';
  modalDisplay: string = 'none';

  constructor(private modalService: ModalService, private dashboardService: DashboardService) {

  }

  ngOnInit() {
    this.dashboardService.modalShowUp.subscribe((value: string) => {
      this.modalDisplay = 'flex';
    })

    this.dashboardService.modalClose.subscribe(() => {
      this.modalDisplay = 'none';
    })
  }

  ngAfterViewInit() {
  }

  openModal(id: string) {
    this.modalService.open(id);
    console.log("Open " + id)

  }

  closeModal(id: string) {
      this.modalService.close(id);
  }
}
