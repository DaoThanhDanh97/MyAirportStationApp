import { Component, OnInit, Input, AfterViewInit, ViewChild, DoCheck, OnChanges, SimpleChanges, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { Metar24hWindDegreeDirective } from 'src/app/directives/metar-24h-wind-degree.directive';

@Component({
  selector: 'app-map-station-detail-area',
  templateUrl: './map-station-detail-area.component.html',
  styleUrls: ['./map-station-detail-area.component.css']
})
export class MapStationDetailAreaComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() chartTitle: string;
  @Input() chartType: string;
  @Input() chartColumnsNames: Array<any>;
  @Input() chartData: Array<Array<any>>;
  @Input() chartOptions: any;
  @Input() isEnd: boolean;
  @Input() divId: string;

  chart: any;
  initDone: boolean = false;
  rotationArray: Array<number> = [];

  @ViewChildren(Metar24hWindDegreeDirective) metar24hMarker: QueryList<Metar24hWindDegreeDirective>;

  constructor() { }

  ngOnInit() {
    if (this.divId == 'wind-cond-chart-id') {
      this.chartColumnsNames = [this.chartColumnsNames[0], this.chartColumnsNames[2]];
      this.rotationArray = this.chartData.map(item => parseInt(item[1]));
      this.chartData = this.chartData.map(item => { return [item[0], item[2]] });
    }

    else if (this.divId == 'alt_slp_chart_id') {
      this.chartColumnsNames = [this.chartColumnsNames[0], this.chartColumnsNames[1]];
      this.chartColumnsNames.push({type: 'string', role: 'tooltip'});
      this.chartData = this.chartData.map(item => {return [parseFloat(item[1]), parseFloat(item[2]), this.createToolTipContent(item)]});
    }
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    google.charts.load('current', { 'packages': ['corechart', 'treemap'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
  }

  drawChart() {   
    //console.log(this.divId);
    var data = google.visualization.arrayToDataTable([this.chartColumnsNames, ...this.chartData]);
    if(this.divId == 'cloud-tree-map-id') {
      data = new google.visualization.DataTable();
      this.chartColumnsNames.map((item, index) => {
        let colType = (index < 2)? 'string' : 'number';
        data.addColumn(colType, item);
      })
      data.addRows(this.chartData);
    }
    this.chart = this.createChart(this.divId);
    if (this.divId == 'wind-cond-chart-id') {
      google.visualization.events.addListener(this.chart, 'ready', this.placeMarker.bind(this, data));
    }
    if (this.divId == 'cloud-tree-map-id') {
      google.visualization.events.addListener(this.chart, 'ready', this.testFunction.bind(this));
    }
    this.chart.draw(data, this.chartOptions);
  }

  createChart(divId: string) {
    //console.log(divId);
    switch (divId) {
      case 'temperature-chart-id': {
        return new google.visualization.LineChart(document.getElementById(this.divId));
      }
      case 'altimeter-chart-id': {
        return new google.visualization.ScatterChart(document.getElementById(this.divId));
      }
      case 'wind-cond-chart-id': {
        return new google.visualization.ScatterChart(document.getElementById(this.divId));
      }
      case 'visibility-chart-id': {
        return new google.visualization.ScatterChart(document.getElementById(this.divId));
      }
      case 'cloud-tree-map-id': {
        return new google.visualization.TreeMap(document.getElementById(this.divId));
      }
      case 'alt_slp_chart_id': {
        return new google.visualization.ScatterChart(document.getElementById(this.divId));
      }
      default: return null
    }
  }

  placeMarker(dataTable) {
    var cli = this.chart.getChartLayoutInterface();
    var chartArea = cli.getChartAreaBoundingBox();
    // this.metar24hMarker.getResult({top: Math.floor(cli.getYLocation(dataTable.getValue(0, 1))), left: Math.floor(cli.getXLocation(0))}) //152px, 52px vs 101, 66

    console.log(chartArea);

    this.metar24hMarker.toArray().map((item, index) => {
      item.getResult({
        top: Math.floor(cli.getYLocation(dataTable.getValue(index, 1))),
        left: Math.floor(cli.getXLocation(index))
      })
    })
  }

  createToolTipContent(item: any) {
    return ('Time Observed: ' + item[0] + '\n' + 'Altimeter: ' + item[1] + '\n' + 'Sea Level Pressure: ' + item[2]);
  }

  testFunction() {
    document.getElementById('cloud-tree-map-id').addEventListener('click', (event) => {
      console.log(event.clientX, event.clientY);
      var gHTMLColArr = document.getElementById('cloud-tree-map-id').getElementsByTagName('g');
      var gArray = Array.prototype.slice.call(gHTMLColArr);
      if (gArray[gArray.length - 1].style.cursor == "") {
        //not recommended, will change later
        gArray[gArray.length - 1].remove();
      }
    })
  }
}
