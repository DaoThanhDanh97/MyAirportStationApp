import { Component, OnInit, Input } from '@angular/core';
import { Data24hService } from 'src/app/services/data-24h.service';
import { DetailChart } from 'src/app/models/detail-chart.model';
import { MapResetService } from 'src/app/services/map-reset.service';

@Component({
  selector: 'app-map-station-metar-detail',
  templateUrl: './map-station-metar-detail.component.html',
  styleUrls: ['./map-station-metar-detail.component.css']
})
export class MapStationMetarDetailComponent implements OnInit {
  @Input() marginTopValue: string;
  dataFound: boolean = false;

  dataReportArray: Array<DetailChart>;

  lineChartOptions = {
    colors: ['#e0440e', '#66693e'],
    legend: { position: 'bottom', textStyle: {fontSize: 15} },
    hAxis: {
      textStyle: {
        fontSize: 10,
      },
      showTextEvery: 3
    },
    vAxis: {
      textStyle: {
        fontSize: 12
      }
    },
    chartArea: {left: 57, top: 25, width: "80%", height: "70%"}
  }

  altimeterChartOptions = {
    legend: { position: 'none' },
    colors: ['lightblue'],
    chartArea: {left: 57, top: 25, width: "80%", height: "70%"},
  }

  windChartOptions = {
    legend: { position: 'none' },
    colors: ['green'],
    chartArea: {left: 57, top: 25, width: "80%", height: "70%"},
  }

  visibilityChartOptions = {
    legend: { position: 'none' },
    colors: ['orange'],
    chartArea: {left: 57, top: 25, width: "80%", height: "70%"},
  }

  altSLPChartOptions = {
    legend: { position: 'none' },
    colors: ['yellow'],
    chartArea: {left: 57, top: 25, width: "80%", height: "70%"},
    hAxis: {
      title: 'Altimeter (hg)'
    },
    vAxis: {
      title: 'Sea Level Pressure (mb)'
    },
    theme: 'Material',
    tooltip: {isHtml: true}
  }

  treeMapOptions = {
    maxDepth: 1,
    maxPostDepth: 2,
    minColor: '#dde7ee',
    midColor: '#396b89',
    maxColor: '#202547',
    fontColor: 'white',
    showScale: true,
    height: "100%",
    useWeightedAverageForAggregation: true,
  }

  constructor(private data24hService: Data24hService, private mapResetService: MapResetService) {
    this.marginTopValue = '0px';
    this.initDataReport();
  }

  ngOnInit() {
    this.data24hService.passMetarDetailEvent.subscribe(() => {
      let tempData = this.data24hService.getTemperature();
      let dewPointData = this.data24hService.getDewPoint();
      let tempDewColumnsData = tempData.map((item, index) => {
        let timeString = this.createHourMinuteString(item.observation_time);
        return [timeString, parseFloat(item.temp_c), parseFloat(dewPointData[index].dewpoint_c)];
      });
      this.data24hService.getAltSLP();
      this.dataReportArray[0].data = tempDewColumnsData;
      this.dataReportArray[1].data = this.createDataFromSource(this.data24hService.getAltimeter(), this.dataReportArray[1].divId);
      this.dataReportArray[2].data = this.createDataFromSource(this.data24hService.getWind(), this.dataReportArray[2].divId);      
      this.dataReportArray[3].data = this.createDataFromSource(this.data24hService.getVisibility(), this.dataReportArray[3].divId);
      this.dataReportArray[4].data = this.createDataFromSource(this.data24hService.getCloudCover(), this.dataReportArray[4].divId);
      this.dataReportArray[5].data = this.createDataFromSource(this.data24hService.getAltSLP(), this.dataReportArray[5].divId);
      this.dataFound = true;
    })

    this.data24hService.resetDataEvent.subscribe((value: string) => {
      this.initDataReport();
      this.dataFound = false;
      this.data24hService.fetchMetarData24h(value);
    })

    this.mapResetService.dashboardResetEvent.subscribe(() => {
      this.initDataReport();
      this.dataFound = false;
    })
  }

  updateMarginTop(value: string) {
    this.marginTopValue = value;
  }

  createHourMinuteString(zDate: string) {
    let newDate = new Date(zDate);
    let getDateHours = (newDate.getHours() < 10)? ("0" + newDate.getHours()) : (newDate.getHours() + "");
    let getDateMinutes = (newDate.getMinutes() < 10)? ("0" + newDate.getMinutes()) : (newDate.getMinutes() + "");
    return (getDateHours + ":" + getDateMinutes);
  }

  createDataFromSource(src: any, divId: string) {
    if (divId == 'altimeter-chart-id' || divId == 'visibility-chart-id') {
      return src.reverse().map((item: {observation_time: string, value: string}) => {
        let timeString = this.createHourMinuteString(item.observation_time);
        return [timeString, parseFloat(Object.values(item)[1])]
      })
    }
    else if (divId == 'alt_slp_chart_id') {
      return src.reverse().map((item: {altim_in_hg: string, sea_level_pressure_mb: string, observation_time: string}) => {
        let timeString = this.createHourMinuteString(item.observation_time);
        return [timeString, parseFloat(Object.values(item)[1]), parseFloat(Object.values(item)[2])];
      })
    }
    else if (divId == 'wind-cond-chart-id') {
      return src.reverse().map((item: {observation_time: string, value: string}) => {
        let timeString = this.createHourMinuteString(item.observation_time);
        return [timeString, parseFloat(Object.values(item)[1]), parseFloat(Object.values(item)[2])];
      })
    }
    else if (divId == 'cloud-tree-map-id') {
      let data = [
        ['Report Data', null, 0],
        ['SKC', 'Report Data', null],
        ['FEW', 'Report Data', null],
        ['SCT', 'Report Data', null],
        ['BKN', 'Report Data', null],
        ['OVC', 'Report Data', null],
      ]
      let possibleArray = ['SKC', 'FEW', 'SCT', 'BKN', 'OVC'];
      src.reverse().map((item: {observation_time: string, "@attributes": Object}, index) => {
        if(possibleArray.indexOf(item["@attributes"]["sky_cover"]) > -1) {
          let timeString = this.createHourMinuteString(item.observation_time);
          data.push([{v: (index + ""), f: timeString}, item["@attributes"]["sky_cover"], parseInt(item["@attributes"]["cloud_base_ft_agl"])]);
        }
      })
      return data;
    }
  }

  initDataReport() {
    this.dataReportArray = [
      new DetailChart(
        'Temperature / Dew Point Temperature (C)',
        'LineChart',
        ["Time", "Temperature", "Dew Point Temperature"],
        this.lineChartOptions,
        false,
        'temperature-chart-id'
      ),
      new DetailChart(
        'Altimeter',
        'Scatter',
        ["Time", "Altimeter"],
        this.altimeterChartOptions,
        false,
        'altimeter-chart-id'
      ),
      new DetailChart(
        'Wind Condition',
        'Scatter',
        ["Time", "Wind Speed", "Wind Degree"],
        this.windChartOptions,
        false,
        'wind-cond-chart-id'
      ),
      new DetailChart(
        'Visibility',
        'Scatter',
        ["Time", "Visibility"],
        this.visibilityChartOptions,
        false,
        'visibility-chart-id'
      ),
      new DetailChart(
        'Cloud Coverage',
        'Treemap',
        ['Data', 'Parent', 'Coverage Value'],
        this.treeMapOptions,
        false,
        'cloud-tree-map-id'
      ),
      new DetailChart(
        'Altimeter & Sea Level Pressure',
        'Scatter',
        ["Altimeter", "Sea Level Pressure"],
        this.altSLPChartOptions,
        true,
        'alt_slp_chart_id'
      )
    ]
  }
}
