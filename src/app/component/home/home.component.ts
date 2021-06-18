import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Covid19Service} from '../../service/covid19.service';
import {CovidData} from '../../model/CovidData';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../service/notification.service';
import {ChartType} from 'chart.js';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router,
    private covid19Service: Covid19Service,
    private datePipe: DatePipe,
  ) {}
  public showSearchBox = true;

  myControl = new FormControl();
  options: { name: string; value: string }[] = [];
  filteredOptions: Observable<{ name: string; value: string }[]>;

  @ViewChild('myCanvas')
  public canvas: ElementRef;
  public context: CanvasRenderingContext2D;
  public chartType: ChartType = 'line';
  public chartData: any[];
  public chartLabels: any[];
  public chartColors: any[];
  public chartOptions: any;
  public showChart: boolean;

  private static numberFormatter(num): string {
    let res: string;
    if (Math.abs(num) >= 1000000) {
      res = (Math.abs(num) / 1000000).toFixed(1) + 'M';
    } else if (Math.abs(num) >= 1000){
      res = (Math.abs(num) / 1000).toFixed(1) + 'K';
    } else {
      res = num;
    }
    return res;
  }

  ngOnInit(): void {
    this.initCountries();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.showChart = false;
    this.initChart();
  }

  displayFn(selectedValue): string {
    if (!selectedValue) { return selectedValue; }
    console.log(selectedValue);
    this.covid19Service.getCountryData(selectedValue)
      .subscribe(
        (res) => this.populateChart(res),
        (error) => console.log(error.error),
        () => this.showChart = true
      );
    return selectedValue;
  }

  private _filter(value: string): { name: string; value: string }[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  public initCountries(): void {
    this.covid19Service.getCountries()
      .subscribe(
        res => {
          this.options = res.map((country) => {
            return {value: country.Slug, name: country.Country};
          });
          this.showSearchBox = false;
          setTimeout(() => this.showSearchBox = true, 0);
        },
        error => console.log(error.error)
      );
  }

  private initChart(): void {
    this.chartColors = [{
      backgroundColor: 'rgba(255,255,255,0.34)',
      borderColor: '#724293'
    }];
    this.chartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 2,
            callback: (value, index, values) => {
              return HomeComponent.numberFormatter(value);
            }
          }
        }]
      },
      annotation: {
        drawTime: 'beforeDatasetsDraw',
        annotations: [{
          type: 'box',
          id: 'a-box-1',
          yScaleID: 'y-axis-0',
          yMin: 0,
          yMax: 1,
          backgroundColor: '#4cf03b'
        }, {
          type: 'box',
          id: 'a-box-2',
          yScaleID: 'y-axis-0',
          yMin: 1,
          yMax: 2.7,
          backgroundColor: '#fefe32'
        }, {
          type: 'box',
          id: 'a-box-3',
          yScaleID: 'y-axis-0',
          yMin: 2.7,
          yMax: 5,
          backgroundColor: '#fe3232'
        }]
      }
    };
  }

  public populateChart(data: CovidData[]): void {
    const dailyNewCases = [];
    dailyNewCases.push(0);
    for (let i = 1; i < data.length; i++) {
      dailyNewCases.push( data[i].Confirmed - data[i - 1].Confirmed);
    }
    this.chartData = [{
      data: dailyNewCases, // data.map((dayData) => dayData.Active),
      label: 'Daily Active Cases',
      fill: true,
      tension: 0.4
    }];
    this.chartLabels = data.map((dayData) => this.datePipe.transform(new Date(dayData.Date), 'd MMM'));
  }

}
