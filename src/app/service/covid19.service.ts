import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Country} from '../model/Country';
import {DatePipe} from "@angular/common";
import {CovidData} from "../model/CovidData";


@Injectable({
  providedIn: 'root'
})
export class Covid19Service {

  private apiUrl: string = environment.covidApiUrl;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
  ) { }

  public getCountryData(country: string): Observable<CovidData[]> {
    const oneMonthAgoDate = new Date().setDate(new Date().getDate() - 31);
    const from = this.datePipe.transform(new Date(oneMonthAgoDate), 'yyyy-MM-dd');
    const to = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    return this.http.get<CovidData[]>(`${this.apiUrl}/country/${country}?from=${from}&to=${to}`);
  }

  public getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`);
  }
}
