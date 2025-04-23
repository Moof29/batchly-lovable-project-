
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface CustomerPortalHeaderProps {
  onBack: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabSelect: (tabKey: string) => void;
}

export const CustomerPortalHeader = ({
  onBack,
  mobileMenuOpen,
  setMobileMenuOpen,
  tabs,
  activeTab,
  onTabSelect,
}: CustomerPortalHeaderProps) => (
  <header className="sticky top-0 z-30 w-full bg-white shadow-md flex flex-col items-center px-4 py-4 border-b">
    <div className="flex items-center w-full max-w-4xl mx-auto">
      <button
        onClick={onBack}
        aria-label="Back to Admin"
        className="hover:bg-gray-100 rounded-full p-2 mr-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
        tabIndex={0}
        type="button"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden />
      </button>
      <h1 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight flex-grow text-center" style={{ letterSpacing: "-0.01em" }}>
        Customer Portal
      </h1>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="pt-12">
          <div className="flex flex-col gap-2 py-2">
            {tabs.map(tab => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                className="justify-start text-lg py-3"
                onClick={() => onTabSelect(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
    <div className="hidden md:flex w-full max-w-4xl mx-auto mt-4 gap-2">
      {tabs.map(tab => (
        <button
          key={tab.key}
          aria-label={`${tab.label} Tab`}
          className={`flex-1 md:flex-initial text-center px-4 py-2 transition-colors font-medium rounded-t-md outline-none
            ${activeTab === tab.key
              ? "bg-brand-500 text-white focus:ring-2 focus:ring-brand-500 shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-brand-500"
            }
          `}
          onClick={() => onTabSelect(tab.key)}
          tabIndex={0}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </header>
);

export default CustomerPortalHeader;
