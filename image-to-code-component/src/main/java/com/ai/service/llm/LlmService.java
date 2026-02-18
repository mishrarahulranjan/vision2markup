package com.ai.service.llm;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LlmService {

    private final ChatClient chatClient;

    public String generateCodeFromImage(byte[] imageBytes, String mimeType, String style) {
        String prompt = """
            Convert this screenshot into clean, modern, responsive HTML + Tailwind CSS + vanilla JS.
            Use Tailwind via CDN. Return ONLY the HTML code.
            Style preference: %s
            """.formatted(style != null ? style : "modern");

        return chatClient.prompt()
                .system("You are an expert frontend developer.")
                .user(u -> u
                        .text(prompt)
                        .media(MediaType.parseMediaType(mimeType), new ByteArrayResource(imageBytes))
                )
                .call()
                .content();
    }
}