
export enum TicketType {
  TRAVEL_TICKET= 'Travel Tickets',
  HOTEL_STAYS = 'Hotel Stays',
  VISA = 'Visa',
  WORK_PERMIT = 'Work Permit'
}

export enum TicketStatus {
  SUBMITTED = 'Submitted',
  RESUBMITTED = 'Resubmitted',
  INPROCESS = 'InProcess',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected',
}

export enum TicketPriorityType {
  NORMAL = 'Normal',
  URGENT = 'Urgent',
  IMMEDIATE = 'Immediate',
}

export enum ExpenseBorneByType {
  COMPANY = 'Company',
  CLIENT = 'Client',
}

export enum TicketSortType {
  DATE = 'Date',
  PRIORITY = 'Priority',
}

export enum TicketFilterType {
  PRIORITY = 'Priority',
  PROJECT_NAME = 'Project Name',
  BUSINESS_UNIT = 'Business Unit',
  PERSON = 'Person',
}

export function getTicketPriorityOrdinal(priority: string): number {
  if (priority === TicketPriorityType.IMMEDIATE) {
    return 3;
  }
  if (priority === TicketPriorityType.URGENT) {
    return 2;
  } else {
    return 1;
  }
}
