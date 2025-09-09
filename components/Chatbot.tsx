"use client";
import React, { useState } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    console.log(data);
    setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full border rounded-lg shadow p-4 bg-white">
      <h2 className="font-bold mb-2">🤖 Task Assistant</h2>
      <div className="flex-1 mb-2">
        <div className="overflow-y-auto space-y-2 h-[350px] pr-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-md ${
                m.role === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
      </div>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about your tasks..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
