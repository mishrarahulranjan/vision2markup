package com.ai.service.llm;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient chatClient;

    public String chat(String conversationId, String message) {

        return chatClient.prompt()
                .user(message)
                .advisors(a-> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();
    }
}
