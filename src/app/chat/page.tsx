'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send, Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';
import type { Message } from "@/lib/schemas";

const initialMessages: Message[] = [
    { id: '1', text: "Hello! I'm the MediQ virtual assistant. How can I help you today?", sender: 'bot' }
];

// The hardcoded script for the conversation
const script = [
    // Question 1
    "Thank you. What is your full name?",
    // Question 2
    "Nice to meet you. Which clinic are you in today (e.g., General, Pediatrics, etc.)?",
    // Question 3
    "Got it. Please describe your symptoms in a few words.",
     // Question 4
    "Thank you for sharing. Have you visited this hospital in the last 6 months?",
    // Final Message
    "Thank you for the information. A doctor will be with you shortly. Please have a seat in the waiting area."
];

const getHardcodedResponse = (userMessagesCount: number): string => {
    // We base the response on the number of *user* messages already sent.
    const responseIndex = userMessagesCount - 1;

    if (responseIndex >= 0 && responseIndex < script.length) {
        return script[responseIndex];
    }
    
    // Default to the final message if the conversation goes beyond the script.
    return script[script.length - 1]; 
};


export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);


  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // 1. Add user's message to state
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: 'user',
    };
    
    // We update the state with the user message, and then in the callback, add the bot's response.
    setMessages(prev => [...prev, userMessage]);
    
    // 2. Get bot's response from the script
    const userMessagesCount = messages.filter(m => m.sender === 'user').length + 1;
    const botResponseText = getHardcodedResponse(userMessagesCount);
    
    const botMessage: Message = {
      id: crypto.randomUUID(),
      text: botResponseText,
      sender: 'bot',
    };
    
    // 3. Add bot's response to state after a short delay to simulate "thinking"
    setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
    }, 500);

    // 4. Clear input
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-screen bg-muted/40">
       <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/">
                <Logo />
            </Link>
            <div className="flex items-center gap-2">
                <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
                <Button asChild><Link href="/register">Register</Link></Button>
            </div>
        </div>
       </header>
       <main className="flex-1 flex flex-col py-4">
        <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl w-full mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-4",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === 'bot' && (
                  <Avatar className="w-10 h-10 border">
                     <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 text-base shadow-sm flex items-center gap-3",
                    message.sender === 'user'
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-background rounded-bl-none"
                  )}
                >
                  <p>{message.text}</p>
                </div>
                 {message.sender === 'user' && (
                  <Avatar className="w-10 h-10 border">
                     <AvatarFallback className="bg-secondary text-secondary-foreground"><User size={20} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className="border-t bg-background">
            <div className="p-4 max-w-4xl w-full mx-auto">
                 <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="flex w-full items-center space-x-4"
                    >
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={"Describe your symptoms..."}
                        className="h-12 text-base"
                    />
                    <Button type="submit" size="icon" className="h-12 w-12" disabled={!inputValue.trim()}>
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
       </main>
    </div>
  );
}

// Basic polyfill for crypto.randomUUID
if (typeof window !== 'undefined' && typeof crypto.randomUUID === 'undefined') {
  crypto.randomUUID = uuidv4;
}
