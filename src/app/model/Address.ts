export class Address {
  public address1: string;
  public address2: string;
  public city: string;
  public state: string;
  public zipCode: string;
  public country: string;

  constructor() {
    this.address1 = '';
    this.address2 = '';
    this.city = '';
    this.state = 'dummy';
    this.zipCode = '';
    this.country = 'dummy';
  }
}
