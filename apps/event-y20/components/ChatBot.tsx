
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getBotResponse } from '../services/geminiService';

const ChatIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="fixed bottom-6 right-6 bg-alvin-blue text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alvin-blue transition-transform transform hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    </button>
);

const CloseIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="text-alvin-gray-500 hover:text-alvin-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>
);

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: 'Hello! How can I help you with the Y20 Social Summit today?' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (userInput.trim() === '' || isLoading) return;
        
        const newUserMessage: ChatMessage = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        const botResponseText = await getBotResponse(userInput);
        const newBotMessage: ChatMessage = { sender: 'bot', text: botResponseText };

        setMessages(prev => [...prev, newBotMessage]);
        setIsLoading(false);
    };

    if (!isOpen) {
        return <ChatIcon onClick={() => setIsOpen(true)} />;
    }

    return (
        <div className="fixed bottom-6 right-6 w-full max-w-sm h-full max-h-[70vh] bg-white rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in-up">
            <header className="flex items-center justify-between p-4 border-b border-alvin-gray-200 bg-alvin-gray-50 rounded-t-lg">
                <h3 className="font-bold text-lg text-alvin-gray-800">Y20 Social Summit Assistant</h3>
                <CloseIcon onClick={() => setIsOpen(false)} />
            </header>

            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.sender === 'user' ? 'bg-alvin-blue text-white' : 'bg-alvin-gray-200 text-alvin-gray-800'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className="rounded-lg px-4 py-2 bg-alvin-gray-200 text-alvin-gray-800">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 border-t border-alvin-gray-200">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question..."
                        className="flex-1 px-4 py-2 border border-alvin-gray-300 rounded-full focus:ring-2 focus:ring-alvin-blue focus:border-alvin-blue transition"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || userInput.trim() === ''} className="bg-alvin-blue text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatBot;
