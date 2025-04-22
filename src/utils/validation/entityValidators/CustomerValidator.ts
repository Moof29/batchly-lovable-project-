
import { ValidationService } from "../ValidationService";
import { DataValidator } from "@/utils/dataValidator";

// Base schema for customer data
export const customerValidationSchema = {
  display_name: [DataValidator.rules.required('Display name'), 
                 DataValidator.rules.maxLength('Display name', 100)],
  email: [DataValidator.rules.email('Email')],
  phone: [DataValidator.rules.pattern('Phone', /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number format')],
  company_name: [DataValidator.rules.maxLength('Company name', 150)]
};

// Additional schema for customer portal submissions
export const customerPortalValidationSchema = {
  billing_address_line1: [DataValidator.rules.maxLength('Billing address line 1', 100)],
  billing_city: [DataValidator.rules.maxLength('Billing city', 50)],
  billing_state: [DataValidator.rules.maxLength('Billing state', 50)],
  billing_postal_code: [DataValidator.rules.pattern('Billing postal code', /^[0-9]{5}(-[0-9]{4})?$/, 'Invalid postal code format')],
  website: [DataValidator.rules.pattern('Website', /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, 'Invalid website URL')]
};

// Create base validator
export const customerBaseValidator = new ValidationService(customerValidationSchema);

// Create portal-specific validator with extended schema
export const customerPortalValidator = new ValidationService({
  ...customerValidationSchema,
  ...customerPortalValidationSchema
}, {
  strictMode: true,
  allowExtraFields: false,
  stripExtraFields: true
});

// Create specialized validation pipelines
export const newCustomerValidator = ValidationService.createPipeline([
  customerBaseValidator,
  new ValidationService({
    email: [DataValidator.rules.required('Email')]
  })
]);

export const updateCustomerValidator = customerPortalValidator;
