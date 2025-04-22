
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const BillListHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Bills</h1>
        <p className="text-sm text-muted-foreground">Manage and track your bills from vendors</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button asChild>
          <Link to="/purchases/bills/new">
            <Plus className="mr-2 h-4 w-4" />
            New Bill
          </Link>
        </Button>
      </div>
    </div>
  );
};
