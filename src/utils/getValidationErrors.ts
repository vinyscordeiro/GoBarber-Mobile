import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}
export default function getValidateErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};
  err.inner.forEach(Error => {
    validationErrors[Error.path] = Error.message;
  });
  console.log(validationErrors);
  return validationErrors;
}
