
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CustomerPortalMessagesTabProps {
  isLoading: boolean;
  messages: any[];
  messageBody: string;
  setMessageBody: (val: string) => void;
  sending: boolean;
  handleSendMessage: (e: React.FormEvent) => void;
}

export const CustomerPortalMessagesTab = ({
  isLoading,
  messages,
  messageBody,
  setMessageBody,
  sending,
  handleSendMessage
}: CustomerPortalMessagesTabProps) => (
  <section className="mt-8">
    <div className="bg-white shadow-lg rounded-xl p-6 max-h-96 overflow-auto mb-4">
      {isLoading ? (
        <p className="py-8 text-center text-gray-400">Loading messages...</p>
      ) : (messages && messages.length > 0 ? (
        <div className="flex flex-col gap-4">
          {messages.map(msg => (
            <div key={msg.id} className="flex flex-col items-start">
              <div className="font-semibold text-gray-900">
                {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
              </div>
              <div className="rounded-xl bg-gray-100 px-4 py-2 my-1 text-gray-900 max-w-full whitespace-pre-line">
                {msg.message}
              </div>
              <div className="text-xs text-gray-500">
                {msg.status === "unread" &&
                  <span className="ml-2 text-blue-600 font-bold">● Unread</span>
                }
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 py-6 text-center">You don't have any messages.</p>
      ))}
    </div>
    <form className="w-full max-w-2xl mx-auto" onSubmit={handleSendMessage} autoComplete="off">
      <Textarea
        className="rounded-md border border-gray-300 p-2 w-full"
        rows={3}
        value={messageBody}
        onChange={e => setMessageBody(e.target.value)}
        placeholder="Type your message…"
        aria-label="Enter your message"
        disabled={sending}
        required
      />
      <Button
        type="submit"
        className="mt-2 bg-brand-500 hover:bg-brand-600 text-white rounded-md py-2 px-4 focus:ring-2 focus:ring-brand-500"
        aria-label="Send message"
        disabled={sending || !messageBody.trim()}
      >
        {sending ? "Sending..." : "Send"}
      </Button>
    </form>
  </section>
);

export default CustomerPortalMessagesTab;
