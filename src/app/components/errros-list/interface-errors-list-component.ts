import { ValidationError } from 'src/app/validation';

export interface IErrorListComponent {
    validationErrors: ValidationError[];
    numberErrorsToDisplay: number;
    readonly displayedErrors: ValidationError[];
}
