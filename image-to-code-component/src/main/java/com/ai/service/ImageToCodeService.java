package com.ai.service;

import com.ai.dto.DesignRequestDto;
import com.ai.dto.GeneratedUiDto;
import com.ai.service.llm.LlmService;
import com.ai.util.HtmlExtractor;
import com.ai.util.ZipGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ImageToCodeService {

    private final LlmService llmService;

    public GeneratedUiDto generateFromImage(MultipartFile file, String style) throws IOException {

        String rawResponse = llmService.generateCodeFromImage(
                file.getBytes(),
                file.getContentType(),
                style
        );

        String cleanHtml = HtmlExtractor.extractCleanHtml(rawResponse);

        return buildZipResponse(cleanHtml, file.getOriginalFilename());
    }

    public String generateImagePreview(MultipartFile file, String style) throws IOException {

        String rawResponse = llmService.generateCodeFromImage(
                file.getBytes(),
                file.getContentType(),
                style
        );

        return HtmlExtractor.extractCleanHtml(rawResponse);
    }

    public GeneratedUiDto generateFromDesign(DesignRequestDto request) {

        String rawResponse = llmService.generateCodeFromDesign(request);

        String cleanHtml = HtmlExtractor.extractCleanHtml(rawResponse);

        return buildZipResponse(cleanHtml, "generated-design");
    }

    public String generateDesignPreview(DesignRequestDto request) {

        String rawResponse = llmService.generateCodeFromDesign(request);

        return HtmlExtractor.extractCleanHtml(rawResponse);
    }

    private GeneratedUiDto buildZipResponse(String html, String baseName) {

        String safeName = baseName == null ? "generated-ui" :
                baseName.replaceAll("[^a-zA-Z0-9]", "_");

        String zipPath = null;
        try {
            zipPath = ZipGenerator.createZipWithHtml(html, safeName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return new GeneratedUiDto(html, zipPath);
    }
}