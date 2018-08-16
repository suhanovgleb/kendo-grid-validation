
export class ValidationError {
  constructor(fieldName: string, item, errType: string, errMessage: string, uniqueFieldNames?: string[]) {
    this.fieldName = fieldName;
    this.item = item;
    this.errType = errType;
    this.errMessage = errMessage;
    this.uniqueFieldNames = uniqueFieldNames;
  }
  public fieldName: string;
  public item;
  public errType: string;
  public errMessage: string;
  public uniqueFieldNames: string[];
}
