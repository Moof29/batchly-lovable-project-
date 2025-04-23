
interface MessagesDisplayProps {
  isLoading: boolean;
  messages: any[];
}

export const MessagesDisplay = ({ isLoading, messages }: MessagesDisplayProps) => {
  if (isLoading) return <p className="py-8 text-center text-gray-400">Loading messages...</p>;
  if (!messages || messages.length === 0)
    return <p className="text-gray-500 py-6 text-center">You don't have any messages.</p>;
  return (
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
  );
};

export default MessagesDisplay;
