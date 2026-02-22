package com.ai.service;

import com.ai.dto.GeneratedUiDto;
import com.ai.dto.WebAppFiles;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
public class UiBundleService {

    private final TempFileCleanupService cleanupService;

    public GeneratedUiDto createBundle(WebAppFiles files, String baseName) {

        try {
            Path tempDir = Files.createTempDirectory("vision2markup-");
            Path zipPath = tempDir.resolve(baseName + ".zip");

            try (ZipOutputStream zos =
                         new ZipOutputStream(
                                 new FileOutputStream(zipPath.toFile()))) {

                addEntry(zos, "index.html", files.index_html());
                addEntry(zos, "style.css", files.style_css());
                addEntry(zos, "script.js", files.script_js());
                addEntry(zos, "README.md", generateReadme());
            }

            cleanupService.registerTempFile(zipPath);

            return new GeneratedUiDto(files.index_html(), zipPath.toString());

        } catch (IOException e) {
            throw new RuntimeException("Zip generation failed", e);
        }
    }

    private void addEntry(ZipOutputStream zos, String name, String content)
            throws IOException {

        if (content == null) return;

        ZipEntry entry = new ZipEntry(name);
        zos.putNextEntry(entry);
        zos.write(content.getBytes(StandardCharsets.UTF_8));
        zos.closeEntry();
    }

    private String generateReadme() {
        return """
            # Vision2Markup Web App

            Files included:
            - index.html
            - style.css
            - script.js

            Open index.html in browser to preview.
            Deploy to any static hosting provider.
            """;
    }
}