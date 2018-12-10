import { ValidatorType } from './validator-type';

export class ValidationError implements ValidationError {
  constructor (public errorInfo: ErrorInfo,
               public item: any,
               public fieldNames: string[]) {}
}

export class ErrorInfo {
  constructor(
    public errorName: string,
    public errorMessage: string,
    public errorType: ValidatorType,
    ) {}
}
