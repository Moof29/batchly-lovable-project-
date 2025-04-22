
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface CustomerMessagesCardProps {
  customerId: string;
  organizationId: string;
}

export const CustomerMessagesCard = ({ customerId, organizationId }: CustomerMessagesCardProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("customer_messages")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setMessages(data);
    }
  }

  useEffect(() => {
    fetchMessages();
    // Optional: add real-time updates later
    // eslint-disable-next-line
  }, [customerId]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("customer_messages").insert({
      customer_id: customerId,
      organization_id: organizationId,
      subject,
      message,
    });
    setLoading(false);
    if (!error) {
      setSubject("");
      setMessage("");
      fetchMessages();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-2 mb-4" onSubmit={handleSendMessage}>
          <Input
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
            aria-label="Message subject"
          />
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            required
            aria-label="Message body"
          />
          <Button type="submit" className="w-full" disabled={loading || !subject || !message}>
            Send Message
          </Button>
        </form>
        <div className="space-y-4 max-h-60 overflow-auto">
          {messages.length === 0 && <div className="text-sm text-gray-500">No messages yet.</div>}
          {messages.map(msg => (
            <div key={msg.id} className="rounded border p-2 bg-gray-50">
              <div className="font-semibold">{msg.subject}</div>
              <div className="text-sm whitespace-pre-line">{msg.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.created_at).toLocaleString()}
                {msg.status === 'unread' && <span className="ml-2 text-blue-600 font-bold">● Unread</span>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
