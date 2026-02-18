package com.ai.service;

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

    public GeneratedUiDto generate(MultipartFile file, String style) throws IOException {
        String html = llmService.generateCodeFromImage(
                file.getBytes(),
                file.getContentType(),
                style
        );

        String cleanHtml = HtmlExtractor.extractCleanHtml(html);
        String zipPath = ZipGenerator.createZipWithHtml(cleanHtml, file.getOriginalFilename());

        return new GeneratedUiDto(cleanHtml, zipPath);
    }
}