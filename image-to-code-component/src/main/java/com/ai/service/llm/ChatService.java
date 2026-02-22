package com.ai.service.llm;

import com.ai.dto.WebAppFiles;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient chatClient;

    public WebAppFiles chat(String systemPrompt, String userPrompt, String mimeType, byte[] imageBytes) {

        return chatClient.prompt()
                .system(systemPrompt)
                .user(u -> u
                        .text(userPrompt)
                        .media(MediaType.parseMediaType(mimeType),
                                new ByteArrayResource(imageBytes))
                )
                .call()
                .entity(WebAppFiles.class);
    }

    public WebAppFiles chat(String systemPrompt, String userPrompt) {

        return chatClient.prompt()
                .system(systemPrompt)
                .user(u -> u
                        .text(userPrompt)
                )
                .call()
                .entity(WebAppFiles.class);
    }
}
