import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPasswords', async: false })
export class MatchPasswords implements ValidatorConstraintInterface {
  validate(passwordConfirm: any, args: ValidationArguments) {
    const [password] = args.constraints;
    const passwordValue = (args.object as any)[password];
    return passwordConfirm === passwordValue;
  }

  defaultMessage() {
    return 'As senhas não coincidem';
  }
}