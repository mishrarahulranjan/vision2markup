package com.ai.service.llm;

import com.ai.dto.DesignRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LlmService {

    private final ChatClient chatClient;

    public String generateCodeFromImage(byte[] imageBytes,
                                        String mimeType,
                                        String style) {

        String systemPrompt = """
            You are a senior frontend engineer.

            You generate clean, production-ready HTML.

            STRICT RULES:
            - Output ONLY raw HTML.
            - Do NOT use markdown.
            - Do NOT wrap in ```html.
            - No explanations.
            - No comments outside HTML.
            - Use Tailwind CSS via CDN.
            - Fully responsive.
            - Use semantic tags.
            - Keep structure clean and organized.
            """;

        String userPrompt = """
            Convert this screenshot into modern, responsive HTML.

            Style preference: %s
            """.formatted(style != null ? style : "modern");

        return chatClient.prompt()
                .system(systemPrompt)
                .user(u -> u
                        .text(userPrompt)
                        .media(MediaType.parseMediaType(mimeType),
                                new ByteArrayResource(imageBytes))
                )
                .call()
                .content();
    }

    public String generateCodeFromDesign(DesignRequestDto request) {

        String systemPrompt = """
            You are a senior frontend engineer.

            Generate a full responsive HTML webpage using Tailwind CSS CDN.

            STRICT RULES:
            - Output ONLY raw HTML.
            - No markdown.
            - No explanation.
            - No comments outside HTML.
            - Use semantic structure.
            - Modern clean layout.
            """;

        StringBuilder components = new StringBuilder();

        request.blocks().forEach(block -> {
            components.append("Component Type: ")
                    .append(block.type())
                    .append("\nContent: ")
                    .append(block.content())
                    .append("\n\n");
        });

        String userPrompt = """
            Build a webpage using these components:

            %s

            Style preference: %s
            """.formatted(
                components,
                request.style() != null ? request.style() : "modern"
        );

        return chatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();
    }
}