
import CustomerPortalTabCard from "./CustomerPortalTabCard";
import MessagesDisplay from "./MessagesDisplay";
import MessageForm from "./MessageForm";

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
    <CustomerPortalTabCard className="max-h-96 overflow-auto mb-4">
      <MessagesDisplay isLoading={isLoading} messages={messages} />
    </CustomerPortalTabCard>
    <MessageForm
      messageBody={messageBody}
      setMessageBody={setMessageBody}
      sending={sending}
      handleSendMessage={handleSendMessage}
    />
  </section>
);

export default CustomerPortalMessagesTab;
