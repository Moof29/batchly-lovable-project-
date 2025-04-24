
import { ValidationService, ValidatorConfig } from "./ValidationService";
import { DataValidator } from "../dataValidator";

/**
 * Factory for creating standardized validation services across the application
 */
export class ValidationFactory {
  /**
   * Creates common validation rules for customer data used in both QBO and Portal
   */
  static createCustomerValidator() {
    return new ValidationService({
      display_name: [
        DataValidator.rules.required('Display Name'),
        DataValidator.rules.maxLength('Display Name', 100)
      ],
      email: [
        DataValidator.rules.email('Email'),
        DataValidator.rules.maxLength('Email', 255)
      ],
      phone: [
        DataValidator.rules.pattern('Phone', /^[0-9\+\-\(\)\s]*$/, 'Invalid phone number format')
      ],
      billing_address_line1: [
        DataValidator.rules.maxLength('Billing Address', 255)
      ],
      billing_city: [
        DataValidator.rules.maxLength('City', 100)
      ],
      billing_state: [
        DataValidator.rules.maxLength('State', 100)
      ],
      billing_postal_code: [
        DataValidator.rules.maxLength('Postal Code', 20)
      ]
    }, { strictMode: false });
  }
  
  /**
   * Creates common validation rules for invoice data used in both QBO and Portal
   */
  static createInvoiceValidator() {
    return new ValidationService({
      total: [
        DataValidator.rules.number('Total'),
        DataValidator.rules.positiveNumber('Total')
      ],
      invoice_date: [
        DataValidator.rules.required('Invoice Date')
      ],
      due_date: [
        DataValidator.rules.custom(
          (value) => !value || new Date(value) >= new Date(), 
          'Due date must be today or in the future'
        )
      ]
    }, { strictMode: false });
  }
  
  /**
   * Creates common validation rules for payment data used in both QBO and Portal
   */
  static createPaymentValidator() {
    return new ValidationService({
      total_amount: [
        DataValidator.rules.required('Payment Amount'),
        DataValidator.rules.positiveNumber('Payment Amount')
      ],
      payment_date: [
        DataValidator.rules.required('Payment Date')
      ],
      payment_method: [
        DataValidator.rules.required('Payment Method')
      ]
    }, { strictMode: false });
  }
  
  /**
   * Extends a base validator with additional QBO-specific validation rules
   */
  static extendWithQboRules<T extends Record<string, any>>(
    baseValidator: ValidationService<T>, 
    additionalRules: Record<string, any>
  ) {
    return baseValidator.extend(additionalRules);
  }
  
  /**
   * Extends a base validator with additional Portal-specific validation rules
   */
  static extendWithPortalRules<T extends Record<string, any>>(
    baseValidator: ValidationService<T>, 
    additionalRules: Record<string, any>
  ) {
    return baseValidator.extend(additionalRules);
  }
}
