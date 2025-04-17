export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_record: {
        Row: {
          account_subtype: string | null
          account_type: string | null
          classification: string | null
          created_at: string | null
          currency_id: string | null
          current_balance: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_sub_account: boolean | null
          last_sync_at: string | null
          name: string
          number: string | null
          opening_balance: number | null
          opening_balance_date: string | null
          organization_id: string | null
          parent_account_id: string | null
          qbo_id: string | null
          sync_status: string | null
          tax_code: string | null
          updated_at: string | null
        }
        Insert: {
          account_subtype?: string | null
          account_type?: string | null
          classification?: string | null
          created_at?: string | null
          currency_id?: string | null
          current_balance?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_sub_account?: boolean | null
          last_sync_at?: string | null
          name: string
          number?: string | null
          opening_balance?: number | null
          opening_balance_date?: string | null
          organization_id?: string | null
          parent_account_id?: string | null
          qbo_id?: string | null
          sync_status?: string | null
          tax_code?: string | null
          updated_at?: string | null
        }
        Update: {
          account_subtype?: string | null
          account_type?: string | null
          classification?: string | null
          created_at?: string | null
          currency_id?: string | null
          current_balance?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_sub_account?: boolean | null
          last_sync_at?: string | null
          name?: string
          number?: string | null
          opening_balance?: number | null
          opening_balance_date?: string | null
          organization_id?: string | null
          parent_account_id?: string | null
          qbo_id?: string | null
          sync_status?: string | null
          tax_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_record_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_record_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_record_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "account_record"
            referencedColumns: ["id"]
          },
        ]
      }
      account_transaction: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          description: string | null
          id: string
          last_sync_at: string | null
          memo: string | null
          reference_id: string | null
          reference_type: string | null
          transaction_date: string
          transaction_type: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_date: string
          transaction_type?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string
          transaction_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_transaction_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account_record"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          created_at: string | null
          description: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          organization_id: string | null
          storage_path: string | null
          updated_at: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          organization_id?: string | null
          storage_path?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          organization_id?: string | null
          storage_path?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_line_item: {
        Row: {
          amount: number | null
          bill_id: string | null
          created_at: string | null
          custom_fields: Json | null
          description: string | null
          id: string
          item_id: string | null
          last_sync_at: string | null
          position: number | null
          quantity: number
          rate: number
          tax_amount: number | null
          tax_code: string | null
          tax_rate: number | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          bill_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          id?: string
          item_id?: string | null
          last_sync_at?: string | null
          position?: number | null
          quantity: number
          rate: number
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          bill_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          id?: string
          item_id?: string | null
          last_sync_at?: string | null
          position?: number | null
          quantity?: number
          rate?: number
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_line_item_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bill_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_line_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_record: {
        Row: {
          balance_due: number | null
          bill_date: string | null
          bill_number: string | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          due_date: string | null
          id: string
          last_sync_at: string | null
          memo: string | null
          organization_id: string | null
          qbo_id: string | null
          status: string | null
          sync_status: string | null
          total: number | null
          updated_at: string | null
          updated_by: string | null
          vendor_id: string | null
        }
        Insert: {
          balance_due?: number | null
          bill_date?: string | null
          bill_number?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          due_date?: string | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          organization_id?: string | null
          qbo_id?: string | null
          status?: string | null
          sync_status?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_id?: string | null
        }
        Update: {
          balance_due?: number | null
          bill_date?: string | null
          bill_number?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          due_date?: string | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          organization_id?: string | null
          qbo_id?: string | null
          status?: string | null
          sync_status?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_record_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_record_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_record_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_record_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      change_log: {
        Row: {
          after_data: Json | null
          before_data: Json | null
          id: string
          ip_address: string | null
          operation_type: string | null
          organization_id: string | null
          record_id: string
          table_name: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          after_data?: Json | null
          before_data?: Json | null
          id?: string
          ip_address?: string | null
          operation_type?: string | null
          organization_id?: string | null
          record_id: string
          table_name: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          after_data?: Json | null
          before_data?: Json | null
          id?: string
          ip_address?: string | null
          operation_type?: string | null
          organization_id?: string | null
          record_id?: string
          table_name?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "change_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      currencies: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          symbol: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_active?: boolean | null
          name: string
          symbol?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          symbol?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_profile: {
        Row: {
          balance: number | null
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country: string | null
          billing_postal_code: string | null
          billing_state: string | null
          company_name: string | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          currency_id: string | null
          custom_fields: Json | null
          display_name: string
          email: string | null
          fax: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          last_sync_at: string | null
          mobile: string | null
          notes: string | null
          organization_id: string | null
          payment_terms: string | null
          phone: string | null
          qbo_id: string | null
          shipping_address_line1: string | null
          shipping_address_line2: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_postal_code: string | null
          shipping_state: string | null
          sync_status: string | null
          tax_exempt: boolean | null
          tax_id: string | null
          updated_at: string | null
          updated_by: string | null
          website: string | null
        }
        Insert: {
          balance?: number | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          currency_id?: string | null
          custom_fields?: Json | null
          display_name: string
          email?: string | null
          fax?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          last_sync_at?: string | null
          mobile?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          qbo_id?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          sync_status?: string | null
          tax_exempt?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          balance?: number | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          currency_id?: string | null
          custom_fields?: Json | null
          display_name?: string
          email?: string | null
          fax?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          last_sync_at?: string | null
          mobile?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          qbo_id?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          sync_status?: string | null
          tax_exempt?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_profile_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_profile_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_profile_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_profile_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_profile: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          birth_date: string | null
          city: string | null
          country: string | null
          created_at: string | null
          custom_fields: Json | null
          display_name: string | null
          email: string | null
          employment_type: string | null
          first_name: string
          gender: string | null
          hire_date: string | null
          id: string
          is_active: boolean | null
          last_name: string
          last_sync_at: string | null
          middle_name: string | null
          mobile: string | null
          organization_id: string | null
          phone: string | null
          postal_code: string | null
          qbo_id: string | null
          release_date: string | null
          ssn: string | null
          state: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          display_name?: string | null
          email?: string | null
          employment_type?: string | null
          first_name: string
          gender?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          last_name: string
          last_sync_at?: string | null
          middle_name?: string | null
          mobile?: string | null
          organization_id?: string | null
          phone?: string | null
          postal_code?: string | null
          qbo_id?: string | null
          release_date?: string | null
          ssn?: string | null
          state?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          display_name?: string | null
          email?: string | null
          employment_type?: string | null
          first_name?: string
          gender?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string
          last_sync_at?: string | null
          middle_name?: string | null
          mobile?: string | null
          organization_id?: string | null
          phone?: string | null
          postal_code?: string | null
          qbo_id?: string | null
          release_date?: string | null
          ssn?: string | null
          state?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_profile_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_time_tracking: {
        Row: {
          billable: boolean | null
          billable_rate: number | null
          break_time: number | null
          created_at: string | null
          customer_id: string | null
          date: string
          description: string | null
          employee_id: string | null
          end_time: string | null
          hours: number
          id: string
          last_sync_at: string | null
          qbo_id: string | null
          service_item_id: string | null
          start_time: string | null
          updated_at: string | null
        }
        Insert: {
          billable?: boolean | null
          billable_rate?: number | null
          break_time?: number | null
          created_at?: string | null
          customer_id?: string | null
          date: string
          description?: string | null
          employee_id?: string | null
          end_time?: string | null
          hours: number
          id?: string
          last_sync_at?: string | null
          qbo_id?: string | null
          service_item_id?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          billable?: boolean | null
          billable_rate?: number | null
          break_time?: number | null
          created_at?: string | null
          customer_id?: string | null
          date?: string
          description?: string | null
          employee_id?: string | null
          end_time?: string | null
          hours?: number
          id?: string
          last_sync_at?: string | null
          qbo_id?: string | null
          service_item_id?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_time_tracking_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_time_tracking_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_time_tracking_service_item_id_fkey"
            columns: ["service_item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_tags: {
        Row: {
          created_at: string | null
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          tag_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          tag_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_tags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_item: {
        Row: {
          amount: number | null
          created_at: string | null
          custom_fields: Json | null
          description: string | null
          discount_amount: number | null
          discount_rate: number | null
          id: string
          invoice_id: string | null
          item_id: string | null
          last_sync_at: string | null
          position: number | null
          quantity: number
          tax_amount: number | null
          tax_code: string | null
          tax_rate: number | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          discount_amount?: number | null
          discount_rate?: number | null
          id?: string
          invoice_id?: string | null
          item_id?: string | null
          last_sync_at?: string | null
          position?: number | null
          quantity: number
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          discount_amount?: number | null
          discount_rate?: number | null
          id?: string
          invoice_id?: string | null
          item_id?: string | null
          last_sync_at?: string | null
          position?: number | null
          quantity?: number
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_item_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_record: {
        Row: {
          balance_due: number | null
          created_at: string | null
          created_by: string | null
          currency_id: string | null
          custom_fields: Json | null
          customer_id: string | null
          discount_rate: number | null
          discount_total: number | null
          discount_type: string | null
          due_date: string | null
          exchange_rate: number | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          last_sync_at: string | null
          memo: string | null
          message: string | null
          organization_id: string | null
          po_number: string | null
          qbo_id: string | null
          ship_date: string | null
          shipping_method: string | null
          shipping_total: number | null
          shipping_tracking: string | null
          status: string | null
          subtotal: number | null
          sync_status: string | null
          tax_total: number | null
          terms: string | null
          total: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          balance_due?: number | null
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          customer_id?: string | null
          discount_rate?: number | null
          discount_total?: number | null
          discount_type?: string | null
          due_date?: string | null
          exchange_rate?: number | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          last_sync_at?: string | null
          memo?: string | null
          message?: string | null
          organization_id?: string | null
          po_number?: string | null
          qbo_id?: string | null
          ship_date?: string | null
          shipping_method?: string | null
          shipping_total?: number | null
          shipping_tracking?: string | null
          status?: string | null
          subtotal?: number | null
          sync_status?: string | null
          tax_total?: number | null
          terms?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          balance_due?: number | null
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          customer_id?: string | null
          discount_rate?: number | null
          discount_total?: number | null
          discount_type?: string | null
          due_date?: string | null
          exchange_rate?: number | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          last_sync_at?: string | null
          memo?: string | null
          message?: string | null
          organization_id?: string | null
          po_number?: string | null
          qbo_id?: string | null
          ship_date?: string | null
          shipping_method?: string | null
          shipping_total?: number | null
          shipping_tracking?: string | null
          status?: string | null
          subtotal?: number | null
          sync_status?: string | null
          tax_total?: number | null
          terms?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_record_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_record_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_record_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_record_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_record_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      item_inventory: {
        Row: {
          average_cost: number | null
          created_at: string | null
          id: string
          item_id: string | null
          last_inventory_date: string | null
          last_sync_at: string | null
          location: string | null
          quantity_available: number | null
          quantity_on_hand: number | null
          quantity_on_order: number | null
          quantity_reserved: number | null
          updated_at: string | null
          warehouse_id: string | null
        }
        Insert: {
          average_cost?: number | null
          created_at?: string | null
          id?: string
          item_id?: string | null
          last_inventory_date?: string | null
          last_sync_at?: string | null
          location?: string | null
          quantity_available?: number | null
          quantity_on_hand?: number | null
          quantity_on_order?: number | null
          quantity_reserved?: number | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Update: {
          average_cost?: number | null
          created_at?: string | null
          id?: string
          item_id?: string | null
          last_inventory_date?: string | null
          last_sync_at?: string | null
          location?: string | null
          quantity_available?: number | null
          quantity_on_hand?: number | null
          quantity_on_order?: number | null
          quantity_reserved?: number | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
        ]
      }
      item_pricing: {
        Row: {
          created_at: string | null
          currency_id: string | null
          effective_date: string | null
          expiration_date: string | null
          id: string
          item_id: string | null
          price: number
          price_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency_id?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          id?: string
          item_id?: string | null
          price: number
          price_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency_id?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          id?: string
          item_id?: string | null
          price?: number
          price_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_pricing_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_pricing_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
        ]
      }
      item_record: {
        Row: {
          asset_account_id: string | null
          created_at: string | null
          custom_fields: Json | null
          description: string | null
          expense_account_id: string | null
          id: string
          income_account_id: string | null
          is_active: boolean | null
          is_taxable: boolean | null
          item_type: string | null
          last_sync_at: string | null
          manufacturer: string | null
          manufacturer_part_number: string | null
          name: string
          organization_id: string | null
          purchase_cost: number | null
          purchase_description: string | null
          qbo_id: string | null
          reorder_point: number | null
          size: string | null
          size_unit: string | null
          sku: string | null
          sync_status: string | null
          tax_code: string | null
          tax_rate: number | null
          updated_at: string | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          asset_account_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          expense_account_id?: string | null
          id?: string
          income_account_id?: string | null
          is_active?: boolean | null
          is_taxable?: boolean | null
          item_type?: string | null
          last_sync_at?: string | null
          manufacturer?: string | null
          manufacturer_part_number?: string | null
          name: string
          organization_id?: string | null
          purchase_cost?: number | null
          purchase_description?: string | null
          qbo_id?: string | null
          reorder_point?: number | null
          size?: string | null
          size_unit?: string | null
          sku?: string | null
          sync_status?: string | null
          tax_code?: string | null
          tax_rate?: number | null
          updated_at?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          asset_account_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          expense_account_id?: string | null
          id?: string
          income_account_id?: string | null
          is_active?: boolean | null
          is_taxable?: boolean | null
          item_type?: string | null
          last_sync_at?: string | null
          manufacturer?: string | null
          manufacturer_part_number?: string | null
          name?: string
          organization_id?: string | null
          purchase_cost?: number | null
          purchase_description?: string | null
          qbo_id?: string | null
          reorder_point?: number | null
          size?: string | null
          size_unit?: string | null
          sku?: string | null
          sync_status?: string | null
          tax_code?: string | null
          tax_rate?: number | null
          updated_at?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_record_asset_account_id_fkey"
            columns: ["asset_account_id"]
            isOneToOne: false
            referencedRelation: "account_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_record_expense_account_id_fkey"
            columns: ["expense_account_id"]
            isOneToOne: false
            referencedRelation: "account_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_record_income_account_id_fkey"
            columns: ["income_account_id"]
            isOneToOne: false
            referencedRelation: "account_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_record_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          name: string
          plan_type: string | null
          qbo_access_token: string | null
          qbo_company_id: string | null
          qbo_realm_id: string | null
          qbo_refresh_token: string | null
          qbo_token_expires_at: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          name: string
          plan_type?: string | null
          qbo_access_token?: string | null
          qbo_company_id?: string | null
          qbo_realm_id?: string | null
          qbo_refresh_token?: string | null
          qbo_token_expires_at?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          name?: string
          plan_type?: string | null
          qbo_access_token?: string | null
          qbo_company_id?: string | null
          qbo_realm_id?: string | null
          qbo_refresh_token?: string | null
          qbo_token_expires_at?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_receipt: {
        Row: {
          created_at: string | null
          created_by: string | null
          currency_id: string | null
          custom_fields: Json | null
          customer_id: string | null
          deposit_account_id: string | null
          exchange_rate: number | null
          external_payment_id: string | null
          id: string
          last_sync_at: string | null
          memo: string | null
          organization_id: string | null
          payment_date: string | null
          payment_gateway: string | null
          payment_link_url: string | null
          payment_method: string | null
          payment_number: string | null
          payment_status: string | null
          process_payment: boolean | null
          qbo_id: string | null
          reference_number: string | null
          sync_status: string | null
          total_amount: number
          unapplied_amount: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          customer_id?: string | null
          deposit_account_id?: string | null
          exchange_rate?: number | null
          external_payment_id?: string | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          organization_id?: string | null
          payment_date?: string | null
          payment_gateway?: string | null
          payment_link_url?: string | null
          payment_method?: string | null
          payment_number?: string | null
          payment_status?: string | null
          process_payment?: boolean | null
          qbo_id?: string | null
          reference_number?: string | null
          sync_status?: string | null
          total_amount: number
          unapplied_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          customer_id?: string | null
          deposit_account_id?: string | null
          exchange_rate?: number | null
          external_payment_id?: string | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          organization_id?: string | null
          payment_date?: string | null
          payment_gateway?: string | null
          payment_link_url?: string | null
          payment_method?: string | null
          payment_number?: string | null
          payment_status?: string | null
          process_payment?: boolean | null
          qbo_id?: string | null
          reference_number?: string | null
          sync_status?: string | null
          total_amount?: number
          unapplied_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_receipt_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_receipt_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_receipt_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_receipt_deposit_account_id_fkey"
            columns: ["deposit_account_id"]
            isOneToOne: false
            referencedRelation: "account_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_receipt_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_receipt_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order: {
        Row: {
          created_at: string | null
          created_by: string | null
          currency_id: string | null
          custom_fields: Json | null
          exchange_rate: number | null
          expected_date: string | null
          id: string
          last_sync_at: string | null
          memo: string | null
          organization_id: string | null
          po_date: string | null
          purchase_order_number: string | null
          qbo_id: string | null
          ship_to: string | null
          status: string | null
          sync_status: string | null
          total: number | null
          updated_at: string | null
          updated_by: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          exchange_rate?: number | null
          expected_date?: string | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          organization_id?: string | null
          po_date?: string | null
          purchase_order_number?: string | null
          qbo_id?: string | null
          ship_to?: string | null
          status?: string | null
          sync_status?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          exchange_rate?: number | null
          expected_date?: string | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          organization_id?: string | null
          po_date?: string | null
          purchase_order_number?: string | null
          qbo_id?: string | null
          ship_to?: string | null
          status?: string | null
          sync_status?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_line_item: {
        Row: {
          amount: number | null
          created_at: string | null
          custom_fields: Json | null
          description: string | null
          id: string
          item_id: string | null
          last_sync_at: string | null
          position: number | null
          purchase_order_id: string | null
          quantity: number
          rate: number
          tax_amount: number | null
          tax_code: string | null
          tax_rate: number | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          id?: string
          item_id?: string | null
          last_sync_at?: string | null
          position?: number | null
          purchase_order_id?: string | null
          quantity: number
          rate: number
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          id?: string
          item_id?: string | null
          last_sync_at?: string | null
          position?: number | null
          purchase_order_id?: string | null
          quantity?: number
          rate?: number
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_line_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_line_item_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_order"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_order: {
        Row: {
          created_at: string | null
          created_by: string | null
          currency_id: string | null
          custom_fields: Json | null
          customer_id: string | null
          customer_po_number: string | null
          discount_rate: number | null
          discount_total: number | null
          discount_type: string | null
          exchange_rate: number | null
          id: string
          last_sync_at: string | null
          memo: string | null
          message: string | null
          order_date: string | null
          order_number: string | null
          organization_id: string | null
          promised_ship_date: string | null
          qbo_estimate_id: string | null
          requested_ship_date: string | null
          shipping_address_line1: string | null
          shipping_address_line2: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_method: string | null
          shipping_postal_code: string | null
          shipping_state: string | null
          shipping_terms: string | null
          shipping_total: number | null
          status: string | null
          subtotal: number | null
          sync_status: string | null
          tax_total: number | null
          terms: string | null
          total: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          customer_id?: string | null
          customer_po_number?: string | null
          discount_rate?: number | null
          discount_total?: number | null
          discount_type?: string | null
          exchange_rate?: number | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          message?: string | null
          order_date?: string | null
          order_number?: string | null
          organization_id?: string | null
          promised_ship_date?: string | null
          qbo_estimate_id?: string | null
          requested_ship_date?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_method?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          shipping_terms?: string | null
          shipping_total?: number | null
          status?: string | null
          subtotal?: number | null
          sync_status?: string | null
          tax_total?: number | null
          terms?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          customer_id?: string | null
          customer_po_number?: string | null
          discount_rate?: number | null
          discount_total?: number | null
          discount_type?: string | null
          exchange_rate?: number | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          message?: string | null
          order_date?: string | null
          order_number?: string | null
          organization_id?: string | null
          promised_ship_date?: string | null
          qbo_estimate_id?: string | null
          requested_ship_date?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_method?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          shipping_terms?: string | null
          shipping_total?: number | null
          status?: string | null
          subtotal?: number | null
          sync_status?: string | null
          tax_total?: number | null
          terms?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_order_fulfillment: {
        Row: {
          carrier: string | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          fulfillment_date: string | null
          fulfillment_number: string | null
          id: string
          last_sync_at: string | null
          notes: string | null
          organization_id: string | null
          sales_order_id: string | null
          shipping_method: string | null
          status: string | null
          sync_status: string | null
          tracking_number: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          carrier?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          fulfillment_date?: string | null
          fulfillment_number?: string | null
          id?: string
          last_sync_at?: string | null
          notes?: string | null
          organization_id?: string | null
          sales_order_id?: string | null
          shipping_method?: string | null
          status?: string | null
          sync_status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          carrier?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          fulfillment_date?: string | null
          fulfillment_number?: string | null
          id?: string
          last_sync_at?: string | null
          notes?: string | null
          organization_id?: string | null
          sales_order_id?: string | null
          shipping_method?: string | null
          status?: string | null
          sync_status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_fulfillment_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_fulfillment_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_fulfillment_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_fulfillment_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_order_fulfillment_line: {
        Row: {
          created_at: string | null
          fulfillment_id: string | null
          id: string
          item_id: string | null
          last_sync_at: string | null
          location_id: string | null
          lot_number: string | null
          notes: string | null
          quantity: number
          sales_order_line_item_id: string | null
          serial_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fulfillment_id?: string | null
          id?: string
          item_id?: string | null
          last_sync_at?: string | null
          location_id?: string | null
          lot_number?: string | null
          notes?: string | null
          quantity: number
          sales_order_line_item_id?: string | null
          serial_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fulfillment_id?: string | null
          id?: string
          item_id?: string | null
          last_sync_at?: string | null
          location_id?: string | null
          lot_number?: string | null
          notes?: string | null
          quantity?: number
          sales_order_line_item_id?: string | null
          serial_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_fulfillment_line_fulfillment_id_fkey"
            columns: ["fulfillment_id"]
            isOneToOne: false
            referencedRelation: "sales_order_fulfillment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_fulfillment_line_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_fulfillment_line_sales_order_line_item_id_fkey"
            columns: ["sales_order_line_item_id"]
            isOneToOne: false
            referencedRelation: "sales_order_line_item"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_order_invoice_link: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          invoice_id: string | null
          sales_order_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          sales_order_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          sales_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_invoice_link_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_invoice_link_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_invoice_link_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_order_line_item: {
        Row: {
          amount: number | null
          created_at: string | null
          custom_fields: Json | null
          description: string | null
          discount_amount: number | null
          discount_rate: number | null
          id: string
          item_id: string | null
          last_sync_at: string | null
          position: number | null
          quantity: number
          quantity_fulfilled: number | null
          quantity_invoiced: number | null
          sales_order_id: string | null
          tax_amount: number | null
          tax_code: string | null
          tax_rate: number | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          discount_amount?: number | null
          discount_rate?: number | null
          id?: string
          item_id?: string | null
          last_sync_at?: string | null
          position?: number | null
          quantity: number
          quantity_fulfilled?: number | null
          quantity_invoiced?: number | null
          sales_order_id?: string | null
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          discount_amount?: number | null
          discount_rate?: number | null
          id?: string
          item_id?: string | null
          last_sync_at?: string | null
          position?: number | null
          quantity?: number
          quantity_fulfilled?: number | null
          quantity_invoiced?: number | null
          sales_order_id?: string | null
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_line_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_line_item_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_order"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_error: {
        Row: {
          created_at: string | null
          entity_type: string
          error_code: string | null
          error_details: string | null
          error_message: string | null
          error_time: string | null
          http_status_code: number | null
          id: string
          qbo_endpoint: string | null
          record_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          retry_count: number | null
          sync_log_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_type: string
          error_code?: string | null
          error_details?: string | null
          error_message?: string | null
          error_time?: string | null
          http_status_code?: number | null
          id?: string
          qbo_endpoint?: string | null
          record_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          retry_count?: number | null
          sync_log_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_type?: string
          error_code?: string | null
          error_details?: string | null
          error_message?: string | null
          error_time?: string | null
          http_status_code?: number | null
          id?: string
          qbo_endpoint?: string | null
          record_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          retry_count?: number | null
          sync_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_error_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_error_sync_log_id_fkey"
            columns: ["sync_log_id"]
            isOneToOne: false
            referencedRelation: "sync_log"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_log: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          notes: string | null
          organization_id: string | null
          records_created: number | null
          records_deleted: number | null
          records_failed: number | null
          records_processed: number | null
          records_updated: number | null
          start_time: string | null
          status: string | null
          sync_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          records_created?: number | null
          records_deleted?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          start_time?: string | null
          status?: string | null
          sync_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          records_created?: number | null
          records_deleted?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          start_time?: string | null
          status?: string | null
          sync_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_status: {
        Row: {
          created_at: string | null
          end_time: string | null
          entity_type: string
          id: string
          records_created: number | null
          records_deleted: number | null
          records_failed: number | null
          records_processed: number | null
          records_updated: number | null
          start_time: string | null
          status: string | null
          sync_log_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          entity_type: string
          id?: string
          records_created?: number | null
          records_deleted?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          start_time?: string | null
          status?: string | null
          sync_log_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          entity_type?: string
          id?: string
          records_created?: number | null
          records_deleted?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          start_time?: string | null
          status?: string | null
          sync_log_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_status_sync_log_id_fkey"
            columns: ["sync_log_id"]
            isOneToOne: false
            referencedRelation: "sync_log"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_agency: {
        Row: {
          country: string | null
          created_at: string | null
          id: string
          name: string
          organization_id: string | null
          registration_number: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          id?: string
          name: string
          organization_id?: string | null
          registration_number?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          registration_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_agency_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_code: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          name: string
          organization_id: string | null
          qbo_id: string | null
          rate: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          name: string
          organization_id?: string | null
          qbo_id?: string | null
          rate?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          name?: string
          organization_id?: string | null
          qbo_id?: string | null
          rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_code_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_rate: {
        Row: {
          agency_id: string | null
          created_at: string | null
          effective_date: string | null
          end_date: string | null
          id: string
          is_combined: boolean | null
          name: string
          rate_value: number
          tax_code_id: string | null
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          effective_date?: string | null
          end_date?: string | null
          id?: string
          is_combined?: boolean | null
          name: string
          rate_value: number
          tax_code_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          effective_date?: string | null
          end_date?: string | null
          id?: string
          is_combined?: boolean | null
          name?: string
          rate_value?: number
          tax_code_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_rate_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "tax_agency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_rate_tax_code_id_fkey"
            columns: ["tax_code_id"]
            isOneToOne: false
            referencedRelation: "tax_code"
            referencedColumns: ["id"]
          },
        ]
      }
      user_organizations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean | null
          organization_id: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_organizations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_organizations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_organizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_profile: {
        Row: {
          account_number: string | null
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country: string | null
          billing_postal_code: string | null
          billing_state: string | null
          company_name: string | null
          created_at: string | null
          created_by: string | null
          currency_id: string | null
          custom_fields: Json | null
          display_name: string
          email: string | null
          fax: string | null
          first_name: string | null
          id: string
          is_1099: boolean | null
          is_active: boolean | null
          last_name: string | null
          last_sync_at: string | null
          mobile: string | null
          notes: string | null
          organization_id: string | null
          payment_terms: string | null
          phone: string | null
          qbo_id: string | null
          sync_status: string | null
          tax_id: string | null
          updated_at: string | null
          updated_by: string | null
          website: string | null
        }
        Insert: {
          account_number?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          display_name: string
          email?: string | null
          fax?: string | null
          first_name?: string | null
          id?: string
          is_1099?: boolean | null
          is_active?: boolean | null
          last_name?: string | null
          last_sync_at?: string | null
          mobile?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          qbo_id?: string | null
          sync_status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          account_number?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          display_name?: string
          email?: string | null
          fax?: string | null
          first_name?: string | null
          id?: string
          is_1099?: boolean | null
          is_active?: boolean | null
          last_name?: string | null
          last_sync_at?: string | null
          mobile?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          qbo_id?: string | null
          sync_status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_profile_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_profile_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_profile_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_profile_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string
          event_type: string
          id: string
          organization_id: string | null
          payload: Json | null
          processed: boolean | null
          processed_at: string | null
          received_at: string | null
          webhook_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          event_type: string
          id?: string
          organization_id?: string | null
          payload?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string | null
          webhook_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          event_type?: string
          id?: string
          organization_id?: string | null
          payload?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string | null
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
