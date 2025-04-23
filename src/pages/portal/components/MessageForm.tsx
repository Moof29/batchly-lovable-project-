
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface MessageFormProps {
  messageBody: string;
  setMessageBody: (val: string) => void;
  sending: boolean;
  handleSendMessage: (e: React.FormEvent) => void;
}

export const MessageForm = ({
  messageBody,
  setMessageBody,
  sending,
  handleSendMessage
}: MessageFormProps) => (
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
);

export default MessageForm;
