import {Address} from './Address';

export class User {

  public username: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public businessUnit: string;
  public title: string;
  public telephone: string;
  public address: Address;
  public isAdmin: boolean;

  constructor() {
    this.username = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.businessUnit = '';
    this.title = '';
    this.telephone = '';
    this.address = new Address();
    this.isAdmin = false;
  }

}
