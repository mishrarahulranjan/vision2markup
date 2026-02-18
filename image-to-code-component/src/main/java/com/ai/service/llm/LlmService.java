package com.ai.service.llm;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LlmService {

    private final ChatClient chatClient;

    private final ChatMemory chatMemory;

    public String generateCodeFromImage(byte[] imageBytes, String mimeType, String additionalInstructions) {

        String system = """
            You are an expert UI developer.
            Convert the screenshot into clean, modern, responsive HTML + Tailwind CSS + vanilla JavaScript.
            Use Tailwind via CDN: <script src="https://cdn.tailwindcss.com"></script>
            Make it mobile-first and add basic interactivity.
            Return **only** the complete HTML file — no explanations outside the code block.
            """;

        if (additionalInstructions != null && !additionalInstructions.isBlank()) {
            system += "\n\nAdditional instructions:\n" + additionalInstructions;
        }

        var response = chatClient.prompt()
                .system(system)
                .user(u -> u
                    .text("Convert this image to production-ready HTML/CSS/JS code.")
                    .media(MediaType.parseMediaType(mimeType), new ByteArrayResource(imageBytes))
                )
                .call()
                .content();

        return response;
    }
}