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
        log.info("call to generateCodeFromDesign with {} blocks", request.blocks().size());
        try {
            String systemPrompt = """
            You are an expert Frontend Architect specializing in high-end SaaS landing pages.
            
            TASK: 
            Generate a high-fidelity, single-page web application based on the user's component list.
            
            TECHNICAL REQUIREMENTS:
            1. Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) in the index_html.
            2. Use Lucide Icons or FontAwesome for visuals.
            3. Use Google Fonts (e.g., 'Inter' or 'Plus Jakarta Sans') for a premium feel.
            4. Return STRICT JSON with keys: "index_html", "style_css", "script_js".
            
            RULES:
            - Maintain the EXACT sequence of components provided.
            - DO NOT include markdown code blocks (```json).
            - Output ONLY the raw JSON object.
            - Ensure every component is responsive (mobile-friendly).
            - Add subtle hover animations using Tailwind transitions.
            """;

            StringBuilder blockList = new StringBuilder();
            for (int i = 0; i < request.blocks().size(); i++) {
                var block = request.blocks().get(i);
                blockList.append(String.format("[%d] TYPE: %s | PROMPT: %s\n", i + 1, block.type(), block.content()));
            }

            String userPrompt = """
            Build a cohesive website with a '%s' aesthetic using these ordered blocks:
            
            %s
            
            INSTRUCTIONS:
            - Assemble these blocks into a single logical <body>.
            - Use the 'style_css' file for custom animations or complex gradients that Tailwind can't handle easily.
            - Use 'script_js' for interactions like mobile menu toggles or scroll-reveal effects.
            """.formatted(
                    request.style() != null ? request.style() : "modern",
                    blockList.toString()
            );

            return chatService.chat(systemPrompt, userPrompt);
        } catch (Exception e) {
            log.error("Exception while generating code from Design", e);
            throw new RuntimeException("AI generation failed", e);
        }
    }
}