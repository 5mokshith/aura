'use server';

import { createServiceClient } from '@/app/lib/supabase/server';
import { Message } from '@/app/types/chat';

export async function getRecentConversation(userId: string, conversationId?: string): Promise<{ conversationId: string; messages: Message[] } | null> {
    if (!userId) return null;

    const supabase = createServiceClient();

    let targetConversationId = conversationId;

    // 1. If no specific conversation requested, get the most recent active one
    if (!targetConversationId) {
        const { data: conversations, error: convError } = await supabase
            .from('conversations')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1);

        if (convError || !conversations || conversations.length === 0) {
            return null;
        }
        targetConversationId = conversations[0].id;
    }

    // Ensure targetConversationId is a string before proceeding
    if (typeof targetConversationId !== 'string') {
        console.error('targetConversationId is not a string after initial determination:', targetConversationId);
        return null;
    }

    // 2. Fetch messages for this conversation
    const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', targetConversationId)
        .order('created_at', { ascending: true });

    if (msgError || !messagesData) {
        console.error('Error fetching messages:', msgError);
        return { conversationId: targetConversationId, messages: [] };
    }

    // 3. Map to frontend Message type
    const messages: Message[] = messagesData.map((msg: any) => {
        const suggestedTasks = msg.suggested_tasks;
        // Handle legacy single suggestion or new array
        const firstSuggestion = Array.isArray(suggestedTasks) && suggestedTasks.length > 0
            ? suggestedTasks[0]
            : null;

        return {
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(msg.created_at),
            suggestedTask: firstSuggestion
                ? {
                    description: firstSuggestion.description,
                    prompt: firstSuggestion.prompt,
                }
                : undefined,
        };
    });

    return { conversationId: targetConversationId, messages };
}

export async function getAllHistory(userId: string, limit = 50, offset = 0) {
    if (!userId) return [];

    const supabase = createServiceClient();

    const { data: tasks, error } = await supabase
        .from('tasks_v2')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching history:', error);
        return [];
    }

    return tasks || [];
}
