"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamChat, Message } from '@/lib/hooks/useTeamChat';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  Send, 
  Users, 
  Hash, 
  Circle, 
  MoreVertical, 
  Search,
  MessageSquare,
  User,
  Shield,
  Loader2,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Smile,
  File,
  Download
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { cn } from '../../utils/cn';
import { TypingIndicator } from '../Collaboration/TypingIndicator';

interface Group {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'team';
  onlineCount: number;
}

const DUMMY_GROUPS: Group[] = [
  { id: 'general', name: 'General', description: 'Public discussion for everyone', type: 'public', onlineCount: 12 },
  { id: 'team-alpha', name: 'Team Alpha', description: 'Internal team coordination', type: 'team', onlineCount: 5 },
  { id: 'dev-ops', name: 'DevOps', description: 'Infrastructure and deployment', type: 'team', onlineCount: 3 },
  { id: 'marketing', name: 'Marketing', description: 'Campaigns and outreach', type: 'public', onlineCount: 8 },
];

interface TeamChatProps {
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const CURRENT_USER = {
  id: 'guest-' + Math.random().toString(36).substr(2, 9),
  name: 'Guest Operative',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
};

export const TeamChat: React.FC<TeamChatProps> = ({ currentUser: propUser }) => {
  const { user: authUser } = useAuth();
  
  const currentUser = propUser || (authUser ? {
    id: authUser.id,
    name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || "Operative",
    avatar: authUser.user_metadata?.avatar_url
  } : CURRENT_USER);

  const [selectedGroup, setSelectedGroup] = useState<Group>(DUMMY_GROUPS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    messages, 
    newMessage, 
    setNewMessage, 
    loading, 
    isUploading,
    error, 
    sendMessage,
    uploadAndSendFile,
    onlineCount,
    typingUsers,
    setTyping
  } = useTeamChat(selectedGroup.id, currentUser);
  
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const emojiPickerRef = React.useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const filteredGroups = DUMMY_GROUPS.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[600px] w-full bg-background/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-primary/10 shadow-2xl">
      {/* Sidebar */}
      <div className="w-72 border-r border-primary/10 flex flex-col bg-muted/30">
        <div className="p-6">
          <h2 className="text-xl font-heading tracking-tight mb-4 flex items-center gap-2">
            <MessageSquare className="text-primary w-5 h-5" />
            Channels
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search rooms..." 
              className="pl-9 bg-background/50 border-none ring-1 ring-primary/10 focus-visible:ring-primary/30 h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
          {filteredGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                selectedGroup.id === group.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "hover:bg-primary/5 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                selectedGroup.id === group.id ? "bg-white/20" : "bg-primary/10"
              )}>
                {group.type === 'team' ? <Shield className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="font-medium truncate">{group.name}</div>
                <div className={cn(
                  "text-[10px] flex items-center gap-1",
                  selectedGroup.id === group.id ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  <Circle className="w-1.5 h-1.5 fill-current text-green-500" />
                  {selectedGroup.id === group.id ? onlineCount : group.onlineCount} online
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-primary/10 bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 p-0.5 shrink-0 overflow-hidden border border-primary/20">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">{currentUser.name}</div>
              <div className="text-[10px] text-muted-foreground">Active now</div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-muted-foreground">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-background/20">
        {/* Header */}
        <div className="h-16 border-b border-primary/10 flex items-center justify-between px-6 bg-background/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {selectedGroup.type === 'team' ? <Shield className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold">{selectedGroup.name}</h3>
              <p className="text-[11px] text-muted-foreground">{selectedGroup.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg">
              <Users className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.length === 0 && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-[11px]">Start the conversation in #{selectedGroup.name}</p>
                </div>
              </motion.div>
            )}
            
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === currentUser.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex gap-3",
                    isMe ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className="w-9 h-9 rounded-full bg-muted shrink-0 overflow-hidden">
                    <img src={msg.sender_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender_name}`} alt={msg.sender_name} className="w-full h-full" />
                  </div>
                  <div className={cn(
                    "flex flex-col max-w-[70%]",
                    isMe ? "items-end" : "items-start"
                  )}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[11px] font-semibold">{isMe ? "You" : msg.sender_name}</span>
                      <span className="text-[9px] text-muted-foreground">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={cn(
                      "px-1 py-1 rounded-2xl text-sm shadow-sm transition-all overflow-hidden",
                      isMe 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted/80 backdrop-blur-sm text-foreground rounded-tl-none border border-primary/5"
                    )}>
                      {msg.message_type === 'text' && (
                        <div className="px-3 py-1.5">{msg.content}</div>
                      )}
                      
                      {msg.message_type === 'image' && (
                        <div className="relative group/img overflow-hidden rounded-xl">
                          <img 
                            src={msg.file_url} 
                            alt="attachment" 
                            className="max-w-full min-w-[200px] h-auto object-cover hover:scale-105 transition-transform duration-500 rounded-xl" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[10px] font-bold text-white truncate max-w-[150px] uppercase tracking-wider">
                                {msg.content || 'Image data'}
                              </span>
                              <a 
                                href={msg.file_url} 
                                download 
                                target="_blank"
                                className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white/20 text-white transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {(msg.message_type === 'pdf' || msg.message_type === 'file') && (
                        <a 
                          href={msg.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center gap-3 p-2.5 min-w-[240px] group/file transition-all rounded-xl",
                            isMe ? "hover:bg-white/10" : "hover:bg-primary/5"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner",
                            msg.message_type === 'pdf' ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary"
                          )}>
                            {msg.message_type === 'pdf' ? <FileText className="w-7 h-7" /> : <File className="w-7 h-7" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-[11px] font-black uppercase tracking-widest truncate mb-0.5",
                              isMe ? "text-primary-foreground" : "text-foreground"
                            )}>
                              {msg.content || 'Attachment'}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] opacity-60 uppercase font-bold tracking-tighter">
                                    {msg.message_type === 'pdf' ? 'Secure PDF' : 'Encrypted Link'}
                                </span>
                                <div className="w-1 h-1 rounded-full bg-current opacity-20" />
                                <span className="text-[9px] opacity-40">Ready for promotion</span>
                            </div>
                          </div>
                          <Download className={cn(
                            "w-4 h-4 transition-all scale-75 opacity-0 group-hover/file:opacity-100 group-hover/file:scale-100",
                            isMe ? "text-primary-foreground" : "text-primary"
                          )} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary/50" />
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mx-6 mb-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-[10px] flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-destructive" />
            {error}
          </div>
        )}

        {/* Typing Status */}
        <div className="px-6 py-2 h-8 flex items-center">
          <TypingIndicator typingUsers={typingUsers} />
        </div>

        {/* Input */}
        <form 
          onSubmit={sendMessage}
          className="p-6 bg-background/40 backdrop-blur-md border-t border-primary/10"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadAndSendFile(file);
            }}
          />

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative group">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className="h-10 w-10 p-0 rounded-xl bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                </Button>
              </div>

              <div className="relative" ref={emojiPickerRef}>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-10 w-10 p-0 rounded-xl transition-all",
                    showEmojiPicker ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary"
                  )}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-4 h-4" />
                </Button>
                
                {/* Enhanced Emoji Picker Popover */}
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-4 z-50 pointer-events-auto"
                    >
                      {/* Interaction Bridge to prevent closing on hover if we were using hover, 
                          but also adds a nice connection line for visuals */}
                      <div className="absolute -bottom-4 left-0 w-full h-4" />
                      
                      <div className="p-4 bg-background/60 backdrop-blur-2xl border border-primary/20 rounded-3xl shadow-2xl w-64 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Express Yourself</span>
                          <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                            <div className="w-1 h-1 rounded-full bg-primary/40" />
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                          {[
                            '🔥', '🚀', '💻', '✨', '✅', 
                            '❌', '👀', '💯', '🤔', '🙌',
                            '⚡️', '🌟', '🎨', '🔍', '⚙️',
                            '📱', '🌐', '🛡️', '📊', '💬'
                          ].map(emoji => (
                            <button 
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setNewMessage(prev => prev + emoji);
                                // Optional: auto-close on click or keep open
                              }}
                              className="w-8 h-8 flex items-center justify-center hover:bg-primary/20 hover:scale-125 rounded-xl transition-all text-base active:scale-95"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-primary/10">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-[9px] text-muted-foreground italic">Try 'rocket'</span>
                            <div className="flex gap-2">
                              {['Recent', 'Smileys', 'Symbols'].map((cat, i) => (
                                <div key={cat} className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-primary" : "bg-muted")} />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Triangle Pointer */}
                        <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-background/60 border-r border-b border-primary/20 rotate-45" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 flex gap-2">
                <Input 
                  placeholder={`Message #${selectedGroup.name}`}
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    setTyping(e.target.value.length > 0);
                  }}
                  className="bg-muted/50 border-none ring-1 ring-primary/10 focus-visible:ring-primary/40 h-10 flex-1"
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  className="h-10 w-10 p-0 rounded-xl shadow-lg shadow-primary/20 shrink-0"
                  disabled={(!newMessage.trim() && !isUploading) || loading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {isUploading && (
              <div className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase tracking-widest animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                Uploading Intercepted Data...
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
