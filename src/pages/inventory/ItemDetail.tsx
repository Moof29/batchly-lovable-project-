
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ItemDetail = () => {
  const { id } = useParams();

  const { data: item, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("item_record")
        .select(`
          *,
          item_pricing(
            price,
            price_type,
            effective_date
          ),
          item_inventory(
            quantity_on_hand,
            quantity_available,
            quantity_on_order,
            warehouse_id,
            location
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {item.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">SKU</dt>
                <dd className="text-sm">{item.sku}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="text-sm capitalize">{item.item_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="text-sm">{item.description}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              {item.item_pricing?.map((pricing: any) => (
                <div key={pricing.id}>
                  <dt className="text-sm font-medium text-gray-500 capitalize">
                    {pricing.price_type} Price
                  </dt>
                  <dd className="text-lg font-bold">
                    ${pricing.price?.toFixed(2)}
                  </dd>
                  {pricing.effective_date && (
                    <dd className="text-sm text-gray-500">
                      Effective from: {new Date(pricing.effective_date).toLocaleDateString()}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {item.item_inventory?.map((inventory: any) => (
                <Card key={inventory.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {inventory.warehouse_id || 'Main Warehouse'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">On Hand</dt>
                        <dd className="text-lg font-bold">{inventory.quantity_on_hand}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Available</dt>
                        <dd>{inventory.quantity_available}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">On Order</dt>
                        <dd>{inventory.quantity_on_order}</dd>
                      </div>
                      {inventory.location && (
                        <div>
                          <dt className="text-sm text-gray-500">Location</dt>
                          <dd>{inventory.location}</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
