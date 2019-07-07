import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service'
import { DashboardService } from 'src/app/services/dashboard.service'
import { Data24hService } from 'src/app/services/data-24h.service'
@Component({
  selector: 'app-altimeter-chart',
  templateUrl: './altimeter-chart.component.html',
  styleUrls: ['./altimeter-chart.component.css']
})
export class AltimeterChartComponent implements OnInit {
  private gLib: any;
  private alti: any;
  constructor(private chartService: ChartService,
    private dashboardService: DashboardService,
    private data24hService: Data24hService) {

  }

  ngOnInit() {
    this.dashboardService.modalShowUp.subscribe((value: string) => {
      this.gLib = this.chartService.getGoogle();
      this.gLib.charts.load('current', { 'packages': ['corechart', 'table'] });
      this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
    })

  }

  private drawChart() {
    this.alti = this.data24hService.getAltimeter();
    console.log("altimeter: ")
    console.log(this.alti)

    
    var data = new this.gLib.visualization.DataTable();
    data.addColumn('string','Observation_time');
    data.addColumn('number','Altimeter');
    this.alti.forEach(item => {
      var newDate = new Date(item.observation_time)
      data.addRow([newDate.getHours() + ":" + newDate.getMinutes(),parseInt(item.altim_in_hg)]);
    })

    console.log(data)

    let chart = new this.gLib.visualization.LineChart(document.getElementById('divLineChartA'));

    chart.draw(data);
  }
}
