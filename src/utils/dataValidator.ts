
/**
 * Data validation utility for QBO data
 * Ensures data consistency and quality before sync operations
 */

type ValidationRule<T> = {
  validator: (value: T) => boolean;
  message: string;
};

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export type ValidationResult = {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
};

export class DataValidator<T extends Record<string, any>> {
  private schema: ValidationSchema<T>;
  
  constructor(schema: ValidationSchema<T>) {
    this.schema = schema;
  }
  
  validate(data: T): ValidationResult {
    const errors: { field: string; message: string }[] = [];
    
    for (const field in this.schema) {
      const rules = this.schema[field];
      const value = data[field];
      
      if (rules) {
        for (const rule of rules) {
          if (!rule.validator(value)) {
            errors.push({
              field,
              message: rule.message
            });
            // Break on first error for this field
            break;
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Utility function to create common validators
  static rules = {
    required: (fieldName: string): ValidationRule<any> => ({
      validator: (value) => value !== undefined && value !== null && value !== '',
      message: `${fieldName} is required`
    }),
    
    minLength: (fieldName: string, min: number): ValidationRule<string> => ({
      validator: (value) => !value || value.length >= min,
      message: `${fieldName} must be at least ${min} characters`
    }),
    
    maxLength: (fieldName: string, max: number): ValidationRule<string> => ({
      validator: (value) => !value || value.length <= max,
      message: `${fieldName} must not exceed ${max} characters`
    }),
    
    pattern: (fieldName: string, regex: RegExp, customMsg?: string): ValidationRule<string> => ({
      validator: (value) => !value || regex.test(value),
      message: customMsg || `${fieldName} has an invalid format`
    }),
    
    email: (fieldName: string): ValidationRule<string> => ({
      validator: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: `${fieldName} must be a valid email address`
    }),
    
    number: (fieldName: string): ValidationRule<any> => ({
      validator: (value) => value === undefined || value === null || value === '' || !isNaN(Number(value)),
      message: `${fieldName} must be a valid number`
    }),
    
    positiveNumber: (fieldName: string): ValidationRule<any> => ({
      validator: (value) => value === undefined || value === null || value === '' || (!isNaN(Number(value)) && Number(value) >= 0),
      message: `${fieldName} must be a positive number`
    }),
    
    custom: (validator: (value: any) => boolean, message: string): ValidationRule<any> => ({
      validator,
      message
    })
  }
}
