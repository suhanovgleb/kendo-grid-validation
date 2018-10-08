import { ValidatorType } from './validator-type';

export class ErrorInfo {
  constructor(
    public errorName: string,
    public errorMessage: string,
    public errorType: ValidatorType,
    ) {}
}

export class ValidationError implements ValidationError {
  constructor (public errorInfo: ErrorInfo,
               public item: any,
               public fieldNames: string | string[]) {}
}
