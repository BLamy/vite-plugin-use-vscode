import React, { useState } from 'react';
import { VSCodeAPI } from './api/vscode-api';

interface MessageEvent {
  data: {
    id: string;
    data?: any;
    error?: string;
  };
}

export function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message: string) => {
    setMessages((prev: string[]) => [...prev, message]);
  };

  const handleShowMessage = async () => {
    try {
      setIsLoading(true);
      const result = await VSCodeAPI.showInformationMessage(inputText || 'Hello from WebView!');
      addMessage(`Showed message, user response: ${result || 'None'}`);
    } catch (error) {
      addMessage(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListFiles = async () => {
    try {
      setIsLoading(true);
      const files = await VSCodeAPI.listWorkspaceFiles();
      addMessage(`Found ${files.length} files in workspace`);
      files.slice(0, 5).forEach((file: string) => {
        addMessage(`- ${file}`);
      });
      if (files.length > 5) {
        addMessage(`... and ${files.length - 5} more`);
      }
    } catch (error) {
      addMessage(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFile = async () => {
    try {
      setIsLoading(true);
      const result = await VSCodeAPI.openTextDocument(inputText);
      addMessage(`Opened document: ${result}`);
    } catch (error) {
      addMessage(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTheme = async () => {
    try {
      setIsLoading(true);
      const theme = await VSCodeAPI.getCurrentTheme();
      addMessage(`Current theme: ${theme.kind} - ${theme.name}`);
    } catch (error) {
      addMessage(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>VS Code API Bridge Demo</h1>
        <p>Demonstrates using the VS Code API from a WebView</p>
      </header>

      <div className="input-group">
        <input
          type="text"
          value={inputText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
          placeholder="Enter message or file path"
          disabled={isLoading}
        />
      </div>

      <div className="button-group">
        <button onClick={handleShowMessage} disabled={isLoading}>
          Show Message
        </button>
        <button onClick={handleListFiles} disabled={isLoading}>
          List Workspace Files
        </button>
        <button onClick={handleOpenFile} disabled={isLoading}>
          Open Document
        </button>
        <button onClick={handleGetTheme} disabled={isLoading}>
          Get Current Theme
        </button>
      </div>

      <div className="messages-container">
        <h2>Messages:</h2>
        {messages.length === 0 ? (
          <p className="empty-message">No messages yet. Try clicking a button above!</p>
        ) : (
          <div className="message-list">
            {messages.map((message: string, index: number) => (
              <div key={index} className="message-item">
                {message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}