export class ValidationError {
  constructor(public fieldName: string, 
              public item: any,
              public errType: string,
              public errMessage: string,
              public fieldNames?: string[]) {}
}
