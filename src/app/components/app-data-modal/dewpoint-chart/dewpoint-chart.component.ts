import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service'
import { DashboardService } from 'src/app/services/dashboard.service'
import { Data24hService } from 'src/app/services/data-24h.service'
@Component({
  selector: 'app-dewpoint-chart',
  templateUrl: './dewpoint-chart.component.html',
  styleUrls: ['./dewpoint-chart.component.css']
})
export class DewpointChartComponent implements OnInit {

  private gLib: any;
  private dewp: any;
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
    this.dewp = this.data24hService.getDewPoint();
   

    
    var data = new this.gLib.visualization.DataTable();
    data.addColumn('string','Observation_time');
    data.addColumn('number','Dewpoint');
    this.dewp.forEach(item => {
      var newDate = new Date(item.observation_time)
      data.addRow([newDate.getHours() + ":" + newDate.getMinutes(),parseInt(item.dewpoint_c)]);
    })

    console.log(data)

    let chart = new this.gLib.visualization.LineChart(document.getElementById('divLineChartD'));

    chart.draw(data);
  }

}
