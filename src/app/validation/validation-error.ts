
export class ValidationError {
  constructor (public fieldNames: string[], 
               public item: any,
               public errType: string,
               public errMessage: string) {}
  // set item(value: any) {
  //   this._item = Object.assign({}, value);
  // }
}
