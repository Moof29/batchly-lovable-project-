
/**
 * Core ValidationService for unified data validation across the application
 * Extends QBO validators to create a shared validation system
 */

import { ValidationResult, ValidationSchema } from "../dataValidator";

export type ValidatorConfig = {
  strictMode?: boolean;
  allowExtraFields?: boolean;
  stripExtraFields?: boolean;
};

export class ValidationService<T extends Record<string, any>> {
  private schema: ValidationSchema<T>;
  private config: ValidatorConfig;
  
  constructor(schema: ValidationSchema<T>, config: ValidatorConfig = {}) {
    this.schema = schema;
    this.config = {
      strictMode: false,
      allowExtraFields: true,
      stripExtraFields: false,
      ...config
    };
  }
  
  validate(data: T): ValidationResult & { sanitized?: T } {
    const errors: { field: string; message: string }[] = [];
    
    // Validate required fields and defined rules
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
            // Break on first error for this field unless in strict mode
            if (!this.config.strictMode) break;
          }
        }
      }
    }
    
    // Check for unexpected fields if configured to not allow them
    if (!this.config.allowExtraFields) {
      for (const field in data) {
        if (!(field in this.schema)) {
          errors.push({
            field,
            message: `Field '${field}' is not allowed in this entity`
          });
        }
      }
    }
    
    // Create result object
    const result: ValidationResult & { sanitized?: T } = {
      isValid: errors.length === 0,
      errors
    };
    
    // Add sanitized data if configured to strip extra fields
    if (this.config.stripExtraFields) {
      result.sanitized = this.stripExtraFields(data);
    }
    
    return result;
  }
  
  stripExtraFields(data: T): T {
    const sanitized: Partial<T> = {};
    
    for (const field in this.schema) {
      if (field in data) {
        sanitized[field as keyof T] = data[field as keyof T];
      }
    }
    
    return sanitized as T;
  }
  
  // Method to extend existing validator with additional rules
  extend(additionalSchema: ValidationSchema<T>): ValidationService<T> {
    const combinedSchema: ValidationSchema<T> = { ...this.schema };
    
    for (const field in additionalSchema) {
      if (field in combinedSchema) {
        combinedSchema[field] = [
          ...(combinedSchema[field] || []),
          ...(additionalSchema[field] || [])
        ];
      } else {
        combinedSchema[field] = additionalSchema[field];
      }
    }
    
    return new ValidationService<T>(combinedSchema, this.config);
  }
  
  // Create a validation pipeline for more complex validations
  static createPipeline<T extends Record<string, any>>(validators: ValidationService<T>[]) {
    return (data: T): ValidationResult & { sanitized?: T } => {
      for (const validator of validators) {
        const result = validator.validate(data);
        if (!result.isValid) {
          return result;
        }
      }
      
      return { isValid: true, errors: [], sanitized: data };
    };
  }
}
