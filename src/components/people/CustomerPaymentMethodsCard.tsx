
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface PaymentMethod {
  id: string;
  payment_type: string;
  is_default: boolean;
  last_four: string;
  card_brand?: string;
  expiry_month?: number;
  expiry_year?: number;
  billing_name?: string;
}

interface CustomerPaymentMethodsCardProps {
  customerId: string;
}

export const CustomerPaymentMethodsCard = ({ customerId }: CustomerPaymentMethodsCardProps) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    payment_type: "credit_card",
    card_brand: "",
    last_four: "",
    expiry_month: "",
    expiry_year: "",
    billing_name: "",
    is_default: false
  });

  const [loading, setLoading] = useState(false);

  async function fetchMethods() {
    const { data, error } = await supabase
      .from("customer_payment_methods")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setMethods(data);
    }
  }

  useEffect(() => {
    fetchMethods();
    // Optional: real-time updates could be added
    // eslint-disable-next-line
  }, [customerId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const insertData = {
      ...form,
      customer_id: customerId,
      last_four: form.last_four,
      expiry_month: form.expiry_month ? parseInt(form.expiry_month) : null,
      expiry_year: form.expiry_year ? parseInt(form.expiry_year) : null,
      is_default: form.is_default,
    };
    const { error } = await supabase.from("customer_payment_methods").insert(insertData);
    setLoading(false);
    if (!error) {
      setShowAdd(false);
      setForm({
        payment_type: "credit_card",
        card_brand: "",
        last_four: "",
        expiry_month: "",
        expiry_year: "",
        billing_name: "",
        is_default: false
      });
      fetchMethods();
    }
  }

  async function handleRemove(id: string) {
    await supabase.from("customer_payment_methods").delete().eq("id", id);
    fetchMethods();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdd(s => !s)}
            aria-label="Add Payment Method"
          >
            {showAdd ? "Cancel" : "Add Payment Method"}
          </Button>
        </div>
        {showAdd && (
          <form className="space-y-2 mb-4" onSubmit={handleAdd}>
            <Input
              placeholder="Billing Name"
              value={form.billing_name}
              onChange={e => setForm(f => ({ ...f, billing_name: e.target.value }))}
              required
              aria-label="Billing name"
            />
            <Input
              placeholder="Card Brand (e.g., Visa)"
              value={form.card_brand}
              onChange={e => setForm(f => ({ ...f, card_brand: e.target.value }))}
              required
              aria-label="Card Brand"
            />
            <Input
              placeholder="Last Four Digits"
              value={form.last_four}
              onChange={e => setForm(f => ({ ...f, last_four: e.target.value }))}
              required
              aria-label="Last four digits"
              maxLength={4}
              pattern="\d{4}"
            />
            <div className="flex gap-2">
              <Input
                placeholder="MM"
                value={form.expiry_month}
                onChange={e => setForm(f => ({ ...f, expiry_month: e.target.value }))}
                required
                type="number"
                min="1"
                max="12"
                aria-label="Expiry month"
                className="w-1/2"
              />
              <Input
                placeholder="YYYY"
                value={form.expiry_year}
                onChange={e => setForm(f => ({ ...f, expiry_year: e.target.value }))}
                required
                type="number"
                min="2020"
                max="2099"
                aria-label="Expiry year"
                className="w-1/2"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))}
                aria-label="Set as default"
              />
              Set as default
            </label>
            <Button type="submit" className="w-full" disabled={loading}>Add Method</Button>
          </form>
        )}
        <div className="space-y-2">
          {methods.length === 0 && <div className="text-sm text-gray-500">No payment methods on file.</div>}
          {methods.map((pm) => (
            <div key={pm.id} className="rounded border p-2 flex items-center justify-between bg-gray-50">
              <div>
                <div className="font-medium">
                  {pm.card_brand} ending in {pm.last_four}
                  {pm.is_default && <span className="ml-2 text-brand-500 font-bold">(Default)</span>}
                </div>
                <div className="text-xs text-gray-500">
                  Exp: {pm.expiry_month}/{pm.expiry_year} &mdash; {pm.billing_name}
                </div>
              </div>
              <Button variant="outline" size="xs" onClick={() => handleRemove(pm.id)} aria-label="Remove">
                Remove
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
