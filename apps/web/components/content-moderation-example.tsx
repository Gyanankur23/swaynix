"use client";

import { useState } from "react";
import { moderatePost, moderateMessage, type ModerationResult } from "@/lib/content-moderation";
import { AlertCircle, X } from "lucide-react";

/**
 * Example: Content Moderation Integration
 * 
 * Use this pattern in your post creation or message components:
 * 1. Call moderatePost() or moderateMessage() before submitting
 * 2. If blocked, show the alert and prevent submission
 * 3. If approved, proceed with the API call
 */

interface ContentModerationAlertProps {
  result: ModerationResult | null;
  onDismiss: () => void;
}

// Simple alert component (uses no external UI dependencies)
export function ContentModerationAlert({ result, onDismiss }: ContentModerationAlertProps) {
  if (!result || result.allowed) return null;

  return (
    <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 animate-in slide-in-from-top-2">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-800">Content Blocked</h4>
          <p className="text-red-700 mt-1">{result.message}</p>
          {result.suggestion && (
            <p className="text-sm text-red-600 mt-1">{result.suggestion}</p>
          )}
          {result.blockedWord && (
            <p className="text-xs text-red-500 mt-2">
              Detected: &ldquo;{result.blockedWord}&rdquo;
            </p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Example: Post Creation Form with Moderation
export function CreatePostWithModeration() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModerationResult(null);

    // Step 1: Moderate content before submitting
    const result = moderatePost(title, content);
    
    if (!result.allowed) {
      // Step 2: Show alert and block submission
      setModerationResult(result);
      return;
    }

    // Step 3: Content is safe - proceed with submission
    setIsSubmitting(true);
    try {
      // Your API call here
      // await createPost({ title, content });
      console.log("Post submitted successfully!");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alert Popup for Blocked Content */}
      <ContentModerationAlert 
        result={moderationResult} 
        onDismiss={() => setModerationResult(null)} 
      />

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          placeholder="Enter post title..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary min-h-[150px]"
          placeholder="What's on your mind?"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim() || !content.trim()}
        className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? "Posting..." : "Create Post"}
      </button>
    </form>
  );
}

// Example: Chat Message Input with Moderation
export function MessageInputWithModeration({ onSend }: { onSend: (msg: string) => void }) {
  const [message, setMessage] = useState("");
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    setModerationResult(null);

    // Moderate message
    const result = moderateMessage(message);

    if (!result.allowed) {
      // Show alert and block
      setModerationResult(result);
      return;
    }

    // Message is safe - send it
    onSend(message);
    setMessage("");
  };

  return (
    <div className="space-y-2">
      {/* Alert Popup */}
      <ContentModerationAlert 
        result={moderationResult} 
        onDismiss={() => setModerationResult(null)} 
      />

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// Quick usage example for any component:
/*
import { moderatePost, moderateMessage } from "@/lib/content-moderation";

// In your submit handler:
const handleSubmit = () => {
  const result = moderatePost(title, content);
  
  if (!result.allowed) {
    // Show alert to user
    alert(result.message);
    return; // Block submission
  }
  
  // Continue with submission...
};
*/
