
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, DollarSign, Warehouse } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export const ItemDetailView = () => {
  const { id } = useParams();

  const { data: item, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("item_record")
        .select(`
          *,
          item_pricing (
            id,
            price,
            price_type,
            effective_date,
            expiration_date,
            currency_id
          ),
          item_inventory (
            id,
            quantity_on_hand,
            quantity_available,
            quantity_on_order,
            quantity_reserved,
            warehouse_id,
            location,
            last_inventory_date,
            average_cost
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span>Loading...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <span>Item not found</span>
        <Button asChild>
          <Link to="/inventory/items">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Items
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            to="/inventory/items"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Items
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{item.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">SKU</div>
                <div>{item.sku}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Type</div>
                <div className="capitalize">{item.item_type || 'N/A'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm font-medium text-muted-foreground">Description</div>
                <div>{item.description || 'No description provided'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Manufacturer</div>
                <div>{item.manufacturer || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Part Number</div>
                <div>{item.manufacturer_part_number || 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Info */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {item.item_pricing?.map((pricing: any) => (
                <div key={pricing.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground capitalize">
                        {pricing.price_type} Price
                      </div>
                      <div className="text-2xl font-bold">
                        ${pricing.price?.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pricing.currency_id || 'USD'}
                    </div>
                  </div>
                  {pricing.effective_date && (
                    <div className="text-sm text-muted-foreground">
                      Valid from: {new Date(pricing.effective_date).toLocaleDateString()}
                      {pricing.expiration_date && 
                        ` to ${new Date(pricing.expiration_date).toLocaleDateString()}`
                      }
                    </div>
                  )}
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Info */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <Warehouse className="h-5 w-5" />
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {item.item_inventory?.map((inventory: any) => (
                <Card key={inventory.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {inventory.warehouse_id || 'Main Warehouse'}
                      {inventory.location && ` - ${inventory.location}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">On Hand</div>
                          <div className="text-xl font-semibold">{inventory.quantity_on_hand}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Available</div>
                          <div className="text-xl font-semibold">{inventory.quantity_available}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">On Order</div>
                          <div>{inventory.quantity_on_order}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Reserved</div>
                          <div>{inventory.quantity_reserved}</div>
                        </div>
                      </div>
                      {inventory.last_inventory_date && (
                        <div className="pt-2">
                          <div className="text-sm font-medium text-muted-foreground">Last Count</div>
                          <div className="text-sm">
                            {new Date(inventory.last_inventory_date).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
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
