
export class ValidationError {
  constructor (public fieldNames: string[], 
               public item: any,
               public errType: string,
               public errMessage: string) {}
}
