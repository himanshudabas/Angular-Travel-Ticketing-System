import {ExpenseBorneByType, TicketPriorityType, TicketStatus, TicketType} from '../enum/ticket-enums';
import {ResolveInfo} from './ResolveInfo';

export class Ticket {
  public id: string;
  public type: string;
  public priority: string;
  public travelTo: string;
  public travelFrom: string;
  public startDate: Date;
  public endDate: Date;
  public passportNumber: string;
  public projectName: string;
  public borneBy: string;
  public approverName: string;
  public expectedDuration: string;
  public maxAllowedAmount: string;
  public moreDetails: string;
  public submitDate: Date;
  public ticketStatus: string;
  public resolveInfo: ResolveInfo;
  public userName: string;
  public employeeId: number;

  constructor() {
    this.id = '';
    this.type = TicketType.TRAVEL_TICKET;
    this.priority = TicketPriorityType.NORMAL;
    this.travelTo = 'dummy';
    this.travelFrom = 'dummy';
    this.startDate = new Date();
    this.endDate = new Date(new Date().setDate(this.startDate.getDate() + 15));
    this.passportNumber = '';
    this.projectName = '';
    this.borneBy = ExpenseBorneByType.COMPANY;
    this.expectedDuration = '';
    this.maxAllowedAmount = '';
    this.moreDetails = '';
    this.resolveInfo = new ResolveInfo();
    this.userName = '';
    this.employeeId = 0;
  }

  public getPriorityEnumValue(t: string): string {
    return TicketPriorityType[t];
  }
  public getTypeEnumValue(t: string): string {
    return TicketType[t];
  }
  public getExpenseBorneEnumValue(t: string): string {
    return ExpenseBorneByType[t];
  }
  public getTicketStatusEnumValue(t: string): string {
    return TicketStatus[t];
  }
}

export class Document {
  public id: number;
  public name: string;
  public type: string;
  public size: number;

  constructor() {
    this.id = 0;
    this.name = '';
    this.type = '';
    this.size = 0;
  }
}

export class TicketResolveInfo {

  public ticketId: number;
  public comment: string;
  public adminName: string;
  public documents: Document[];

  constructor() {
    this.ticketId = 0;
    this.comment = '';
    this.adminName = '';
    this.documents = [];
  }
}
