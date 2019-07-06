import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureChartComponent } from './temperature-chart/temperature-chart.component';

@NgModule({
  declarations: [],
  imports: [
    NgModule,
    CommonModule
  ],
  exports: [TemperatureChartComponent],
  providers : []
})

@Component({
  selector: 'app-app-data-modal',
  templateUrl: './app-data-modal.component.html',
  styleUrls: ['./app-data-modal.component.css']
})
export class AppDataModalComponent implements OnInit {

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
  }

  onCloseModal() {
    this.dashboardService.modalClose.emit();
  }
}
