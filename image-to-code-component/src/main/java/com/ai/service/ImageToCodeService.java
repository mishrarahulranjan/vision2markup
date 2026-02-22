package com.ai.service;

import com.ai.dto.DesignRequestDto;
import com.ai.dto.GeneratedUiDto;
import com.ai.service.llm.LlmService;
import com.ai.util.HtmlExtractor;
import com.ai.util.ZipGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
public class ImageToCodeService {

    private final LlmService llmService;

    public GeneratedUiDto generateFromImage(MultipartFile file, String style) throws IOException {
        String cleanHtml = generateImagePreview(file, style);
        return buildZipResponse(cleanHtml, file.getOriginalFilename());
    }

    @Cacheable(value = "htmlPreviewCache", key = "#root.args[0].originalFilename + '_' + #style")
    public String generateImagePreview(MultipartFile file, String style) throws IOException {
        String rawResponse = llmService.generateCodeFromImage(
                file.getBytes(),
                file.getContentType(),
                style
        );
        return HtmlExtractor.extractCleanHtml(rawResponse);
    }

    public GeneratedUiDto generateFromDesign(DesignRequestDto request) {
        String cleanHtml = generateDesignPreview(request);
        return buildZipResponse(cleanHtml, "generated-design");
    }

    @Cacheable(value = "htmlPreviewCache", key = "'design_' + T(java.util.Objects).hashCode(#request)")
    public String generateDesignPreview(DesignRequestDto request) {
        String rawResponse = llmService.generateCodeFromDesign(request);
        return HtmlExtractor.extractCleanHtml(rawResponse);
    }

    private GeneratedUiDto buildZipResponse(String html, String baseName) {
        String safeName = baseName == null ? "generated-ui" :
                baseName.replaceAll("[^a-zA-Z0-9]", "_");

        try {
            // 1. Create temp folder
            Path tempDir = Files.createTempDirectory("generated-ui-");

            // 2. Write HTML file
            Path htmlFile = tempDir.resolve("index.html");
            Files.writeString(htmlFile, html, StandardCharsets.UTF_8);

            // 3. Create ZIP
            Path zipFile = tempDir.resolve(safeName + ".zip");
            try (FileOutputStream fos = new FileOutputStream(zipFile.toFile());
                 ZipOutputStream zos = new ZipOutputStream(fos)) {

                ZipEntry entry = new ZipEntry("index.html");
                zos.putNextEntry(entry);
                zos.write(html.getBytes(StandardCharsets.UTF_8));
                zos.closeEntry();
            }

            return new GeneratedUiDto(html, zipFile.toAbsolutePath().toString());

        } catch (IOException e) {
            throw new RuntimeException("Failed to generate ZIP", e);
        }
    }
}