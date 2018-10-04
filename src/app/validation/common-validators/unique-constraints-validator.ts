
import { ISchema } from '../../schemes/schema';
import { ValidationError } from '../validation-error';
import { IValidator } from '..';


// Вот тут спорно, валидатор проверяет на уникальность только среди изменённых, это неправильно
export class UniqueConstraintsValidator implements IValidator {
    Assert(items: any[], schema: ISchema): ValidationError[] {
        const errors: ValidationError[] = [];

        const uniqueConstraints = schema.rowValidators.multiRowValidators.uniqueConstraints;

        let hashTable: object = {};

        // fill hashtable with keys-constraints and count number of matches
        for (const item of items) {
            if (!hashTable.hasOwnProperty(this.getNameHash(item, uniqueConstraints))) {
                hashTable[this.getNameHash(item, uniqueConstraints)] = 1;
            } else {
                hashTable[this.getNameHash(item, uniqueConstraints)]++;
            }
        }

        // here we delete all non-repeating items from hashtable
        const tempHashTable: any = {};

        for (const key in hashTable) {
            if (hashTable.hasOwnProperty(key)) {

                if (!(hashTable[key] === 1)) {
                    tempHashTable[key] = hashTable[key];
                }
            }
        }

        hashTable = tempHashTable;

        // filling errors: ValidationError[] with ValidatonError
        for (const item of items) {
            const hashName = this.getNameHash(item, uniqueConstraints);
            if (hashTable.hasOwnProperty(hashName) && hashTable[hashName] !== 0) {
                const errMessageConstraints = uniqueConstraints.join(', ');
                errors.push(
                    new ValidationError(
                        uniqueConstraints,
                        item,
                        'unique',
                        'This entry must be unique in the following fields: ' + errMessageConstraints + '.',
                    )
                );
                hashTable[hashName]--;
            }
        }

        return errors;

    }

    private getNameHash(item, uniqueConstraints): string {
        let name = '';
        for (const constraint of uniqueConstraints) {
            if (uniqueConstraints[0] === constraint) {
                name = name.concat(item[constraint]);
            } else {
                name = name.concat(':', item[constraint]);
            }
        }
        return name;
    }
}
