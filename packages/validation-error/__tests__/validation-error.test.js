import { ValidationError } from '../src/index';

describe('Validation Error Class Test', () => {
  test('expect Class to be initiated', async () => {
    const validationErrors = [
      { message: 'First Name is a required field', property: 'First Name' },
      { message: 'Cannot edit SSN' },
    ];
    const err = new ValidationError(validationErrors);
    expect(err).toBeDefined();
  });
});
