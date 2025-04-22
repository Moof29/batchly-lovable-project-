
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface CustomerPortalMessagesListProps {
  isLoading: boolean;
  messages: any[];
}

export const CustomerPortalMessagesList = ({ isLoading, messages }: CustomerPortalMessagesListProps) => (
  <Card className="bg-white shadow-lg rounded-xl">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">Your Messages</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {isLoading ? (
          <p>Loading messages...</p>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4 max-h-60 overflow-auto">
            {messages.map((msg: any) => (
              <div key={msg.id} className="rounded border p-2 bg-gray-50">
                <div className="font-semibold">{msg.subject}</div>
                <div className="text-sm whitespace-pre-line">{msg.message}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(msg.created_at).toLocaleString()}
                  {msg.status === "unread" && (
                    <span className="ml-2 text-blue-600 font-bold">● Unread</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You don't have any messages.</p>
        )}
      </div>
    </CardContent>
  </Card>
);

export default CustomerPortalMessagesList;
