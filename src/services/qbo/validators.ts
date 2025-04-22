
import { DataValidator } from "@/utils/dataValidator";

// Validation schemas
export const customerValidationSchema = {
  display_name: [DataValidator.rules.required('Display name')],
  email: [DataValidator.rules.email('Email')]
};
export const invoiceValidationSchema = {
  customer_id: [DataValidator.rules.required('Customer ID')],
  invoice_date: [DataValidator.rules.required('Invoice date')],
  total: [DataValidator.rules.positiveNumber('Total amount')]
};
export const billValidationSchema = {
  vendor_id: [DataValidator.rules.required('Vendor ID')],
  bill_date: [DataValidator.rules.required('Bill date')],
  total: [DataValidator.rules.positiveNumber('Total amount')]
};

export const validators = {
  customer_profile: new DataValidator(customerValidationSchema),
  invoice_record: new DataValidator(invoiceValidationSchema),
  bill_record: new DataValidator(billValidationSchema)
};
