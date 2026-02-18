package com.ai.api;

import com.ai.dto.GeneratedUiDto;
import com.ai.service.ImageToCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/ui")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // adjust for production
public class MarkUpGeneratorController {

    private final ImageToCodeService imageToCodeService;

    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Resource> generateAndDownloadZip(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "style", defaultValue = "modern") String style) throws IOException {

        // Call service → get DTO with HTML content & zip path
        GeneratedUiDto result = imageToCodeService.generate(file, style);

        // Prepare ZIP file as downloadable resource
        Resource zipResource = new FileSystemResource(result.zipPath());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"generated-ui.zip\"")
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header(HttpHeaders.EXPIRES, "0")
                .body(zipResource);
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Backend API is running – image to HTML/zip ready";
    }
}