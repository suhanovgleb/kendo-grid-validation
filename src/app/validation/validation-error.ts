
export interface ErrorInfo {
  errorName: string;
  errorMessage: string;
  errorType: string;
}

export class ValidationError implements ValidationError {
  constructor (public errorInfo: ErrorInfo,
               public item: any,
               public fieldNames: string | string[]) {}
}
