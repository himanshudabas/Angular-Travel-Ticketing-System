
export class ResolveInfo {
  public resolveInfoId: number;
  public ticketId: number;
  public adminName: string;
  public comment: string;
  public documents: Document[];

  constructor() {
    this.resolveInfoId = 0;
    this.ticketId = 0;
    this.adminName = '';
    this.comment = '';
    this.documents = [];
  }
}
