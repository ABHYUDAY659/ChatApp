import { useEffect, useRef, useState } from "react";

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onmessage = (event: MessageEvent) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(input);
      setInput("");
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-white text-black p-2 rounded">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex p-2 bg-white">
        <input
          type="text"
          className="flex-1 p-2 text-black outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
