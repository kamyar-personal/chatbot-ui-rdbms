import { Message } from '@/types/chat';

export const rdbmsCreateMessages = async (
  conversationId: string,
  newMessages: Message[],
) => {
  await fetch('api/rdbms/messages', {
    method: 'POST',
    body: JSON.stringify({
      messages: newMessages,
      conversation_id: conversationId,
    }),
  });
};

export const rdbmsUpdateMessages = async (
  conversationId: string,
  updatedMessages: Message[],
) => {
  await fetch('api/rdbms/messages', {
    method: 'PUT',
    body: JSON.stringify({
      messages: updatedMessages,
      conversation_id: conversationId,
    }),
  });
};

export const rdbmsDeleteMessages = async (messageIds: string[]) => {
  await fetch('api/rdbms/messages', {
    method: 'DELETE',
    body: JSON.stringify({ message_ids: messageIds }),
  });
};
