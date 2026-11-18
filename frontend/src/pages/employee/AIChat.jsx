
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { sendChatMessage } from "../../services/chatService";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Send } from "lucide-react";

function AIChat() {
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const text = message.trim();
    setMessages((prev) => [...prev, { role: "user", text }]);
    setMessage("");
    setLoading(true);

    try {
      const { data } = await sendChatMessage(text, token);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.message || "Your request has been processed.",
          status: data.status || data.request?.status,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: error.response?.data?.message || "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-8 flex flex-col">
          <h1 className="text-2xl font-bold text-slate-800">AI Procurement Assistant</h1>
          <p className="text-slate-500 mt-1">Describe what you need to purchase.</p>

          <div className="flex-1 bg-white border rounded-xl p-5 mt-6 space-y-4 overflow-y-auto min-h-80">
            {!messages.length && (
              <p className="text-center text-slate-400 mt-20">
                Hi! Tell me what you need to purchase.
              </p>
            )}

            {messages.map((item, index) => (
              <div key={index} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-lg p-4 rounded-xl ${item.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                  <p>{item.text}</p>
                  {item.status && (
                    <p className="text-xs mt-2 font-semibold">
                      Status: {item.status.replaceAll("_", " ")}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && <p className="text-sm text-slate-400">AI is processing...</p>}
          </div>

          <form onSubmit={handleSend} className="flex gap-3 mt-4">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Example: I need 2 laptops for the development team..."
              className="flex-1 p-4 border rounded-xl outline-none focus:border-blue-500"
              maxLength={2000}
            />
            <button
              disabled={loading || !message.trim()}
              className="bg-blue-600 text-white px-6 rounded-xl disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AIChat;
