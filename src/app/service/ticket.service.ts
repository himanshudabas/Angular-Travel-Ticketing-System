import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Ticket, TicketResolveInfo} from '../model/Ticket';
import {environment} from '../../environments/environment';
import {ExpenseBorneByType, TicketPriorityType, TicketStatus, TicketType} from '../enum/ticket-enums';
import {toFormData} from '../utility/toFormData';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(
    private http: HttpClient,
  ) { }

  private host = environment.apiUrl;

  public static mapTicketEnums(ticket: Ticket): void {
    for (const z in TicketType) {
      if (ticket.type === TicketType[z]) {
        ticket.type = z;
        break;
      }
    }
    for (const z in TicketPriorityType) {
      if (ticket.priority === TicketPriorityType[z]) {
        ticket.priority = z;
        break;
      }
    }
    for (const z in ExpenseBorneByType) {
      if (ticket.borneBy  === ExpenseBorneByType[z]) {
        ticket.borneBy  = z;
        break;
      }
    }
  }

  public static getProgressValueFromStatus(status: string): number {
    if (status === TicketStatus.COMPLETED) {
      return 100;
    } else if (status === TicketStatus.INPROCESS) {
      return 75;
    } else if (status === TicketStatus.RESUBMITTED) {
      return 50;
    } else if (status === TicketStatus.SUBMITTED) {
      return 25;
    } else {
      return 0;
    }
  }

  public static enumToString(tkt: Ticket): void {
    tkt.ticketStatus = TicketStatus[tkt.ticketStatus];
    tkt.type = TicketType[tkt.type];
    tkt.priority = TicketPriorityType[tkt.priority];
    tkt.borneBy = ExpenseBorneByType[tkt.borneBy];
  }

  public createTicket(ticket: Ticket): Observable<Ticket> {
    TicketService.mapTicketEnums(ticket);
    return this.http.post<Ticket>(`${this.host}/tickets/create`, ticket);
  }

  public getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.host}/tickets`);
  }

  public updateTicket(ticket: Ticket, ticketId: string): Observable<Ticket> {
    TicketService.mapTicketEnums(ticket);
    return this.http.post<Ticket>(`${this.host}/tickets/update/${ticketId}`, ticket);
  }

  public getTicket(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.host}/tickets/${ticketId}`);
  }

  public changeResolveInfo(formData: any, ticketId): Observable<HttpEvent<any>> {
    for (const z in TicketStatus) {
      if (formData.ticketStatus === TicketStatus[z]) {
        formData.ticketStatus = z;
        break;
      }
    }
    const frm = toFormData(formData);
    return this.http.put(
      `${this.host}/tickets/resolveInfo/${ticketId}`,
      frm, {
      reportProgress: true,
      observe: 'events'
    });
  }

  public setTicketStatus(status: string, ticketId: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.host}/tickets/setStatus/${ticketId}`, status);
  }

  getTicketResolveInfo(ticketId: string): Observable<TicketResolveInfo> {
    return this.http.get<TicketResolveInfo>(`${this.host}/tickets/resolveInfo/${ticketId}`);
  }

  getDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.host}/tickets/documents/${documentId}`,
      {responseType: 'blob'});
  }

}
