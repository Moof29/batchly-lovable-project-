
import { ValidationService } from "../ValidationService";
import { DataValidator } from "@/utils/dataValidator";

// Base schema for invoice data
export const invoiceValidationSchema = {
  customer_id: [DataValidator.rules.required('Customer ID')],
  invoice_date: [DataValidator.rules.required('Invoice date')],
  total: [DataValidator.rules.positiveNumber('Total amount')]
};

// Additional schema for portal-submitted invoice data
export const invoicePortalValidationSchema = {
  po_number: [DataValidator.rules.maxLength('PO Number', 50)],
  message: [DataValidator.rules.maxLength('Message', 1000)]
};

// Create base validator
export const invoiceBaseValidator = new ValidationService(invoiceValidationSchema);

// Create portal-specific validator with extended schema
export const invoicePortalValidator = new ValidationService({
  ...invoiceValidationSchema,
  ...invoicePortalValidationSchema
}, {
  strictMode: false,
  allowExtraFields: false,
  stripExtraFields: true
});

// Create specialized validation pipeline for invoice line items
export const invoiceLineItemValidator = new ValidationService({
  item_id: [DataValidator.rules.required('Item ID')],
  quantity: [DataValidator.rules.required('Quantity'), 
             DataValidator.rules.positiveNumber('Quantity')],
  unit_price: [DataValidator.rules.required('Unit Price'), 
               DataValidator.rules.positiveNumber('Unit Price')]
});
