package com.ai.service.llm;

import com.ai.dto.DesignRequestDto;
import com.ai.dto.WebAppFiles;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LlmService {

    private final ChatService chatService;

    public WebAppFiles generateCodeFromImage(byte[] imageBytes,
                                             String mimeType,
                                             String style) {
        log.info("call to generateCodeFromImage");
        try{
            String systemPrompt = """
            You are a senior frontend engineer.

            Your task is to generate a complete mockup web app.

            You must return STRICT JSON with this structure:

            {
              "index_html": "...",
              "style_css": "...",
              "script_js": "..."
            }

            RULES:
            - Return JSON only.
            - No markdown.
            - No explanation.
            - No backticks.
            - index_html must be valid HTML5.
            - Do NOT embed CSS inside HTML.
            - Do NOT embed JS inside HTML.
            - Link style.css and script.js properly.
            - CSS must reflect colors, spacing, typography and layout visible in image.
            - Fully responsive.
            - Use semantic HTML.
            - Keep code production clean.
            """;

            String userPrompt = """
            Convert this UI screenshot into a modern responsive web app.

            Style preference: %s

            Requirements:
            - Extract layout from image.
            - Infer color palette.
            - Create separate CSS file.
            - Add basic JS interactions if needed (navbar toggle, buttons etc).
            """.formatted(style != null ? style : "modern");

            return chatService.chat(systemPrompt, userPrompt, mimeType, imageBytes);
        }catch(Exception e){
            log.error("error while generating code from image", e);
            throw new RuntimeException("error while generating code from image", e);
        }

    }

    public WebAppFiles generateCodeFromDesign(DesignRequestDto request) {
        log.info("call to generateCodeFromDesign");
        try{
            String systemPrompt = """
            You are a senior frontend engineer.

            Generate a complete web application.

            Return STRICT JSON only:

            {
              "index_html": "...",
              "style_css": "...",
              "script_js": "..."
            }

            RULES:
            - No markdown.
            - No explanation.
            - Separate HTML, CSS, JS.
            - Responsive layout.
            - Clean semantic structure.
            - Modern UI.
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

            Requirements:
            - Generate layout structure in HTML.
            - Generate styling in CSS file.
            - Add small JS interactions if appropriate.
            """.formatted(
                    components,
                    request.style() != null ? request.style() : "modern"
            );

            return chatService.chat(systemPrompt, userPrompt);
        }catch(Exception e){
            log.error("exception while generating code from Design", e);
            throw new RuntimeException("exception while generating code from Design", e);
        }

    }
}