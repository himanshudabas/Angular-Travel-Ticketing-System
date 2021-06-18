
export class CovidData {

  public ID: string;
  public Country: string;
  public CountryCode: string;
  public Province: string;
  public City: string;
  public CityCode: string;
  public Lat: string;
  public Lon: string;
  public Confirmed: number;
  public Deaths: number;
  public Recovered: number;
  public Active: number;
  public Date: Date;

  constructor() {
    this.ID = '';
    this.Country = '';
    this.CountryCode = '';
    this.Province = '';
    this.City = '';
    this.CityCode = '';
    this.Lat = '';
    this.Lon = '';
    this.Confirmed = 0;
    this.Deaths = 0;
    this.Recovered = 0;
    this.Active = 0;
    this.Date = new Date();
  }
}
