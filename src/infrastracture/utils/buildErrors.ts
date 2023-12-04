import { ValidationError } from 'class-validator';

export function buildErrors(errors: ValidationError[]) {
  return errors.map((error) => ({
    property: error.property,
    errors: error.children.length
      ? buildErrors(error.children)
      : error.constraints
      ? Object.values(error.constraints)
      : [],
  }));
}
