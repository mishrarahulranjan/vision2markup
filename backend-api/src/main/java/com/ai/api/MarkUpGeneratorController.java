package com.ai.api;

import com.ai.dto.DesignRequestDto;
import com.ai.dto.GeneratedUiDto;
import com.ai.dto.WebAppFiles;
import com.ai.service.ImageToCodeService;
import com.ai.service.PreviewCacheService;
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
@CrossOrigin(origins = "*")
public class MarkUpGeneratorController {

    private final ImageToCodeService imageToCodeService;
    private final PreviewCacheService previewCacheService;

    @PostMapping(value = "/generate/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Resource> generateImageZip(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "modern") String style) throws IOException {

        GeneratedUiDto result = imageToCodeService.generateFromImage(file, style);
        Resource zipResource = new FileSystemResource(result.zipPath());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"generated-ui.zip\"")
                .body(zipResource);
    }

    @PostMapping(value = "/generate/image/preview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> generateImagePreview(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "modern") String style) throws IOException {

        WebAppFiles webAppFiles = previewCacheService.generateImagePreview(file, style);

        return ResponseEntity.ok(webAppFiles.index_html());
    }

    @PostMapping("/generate/design/preview")
    public ResponseEntity<String> generateDesignPreview(
            @RequestBody DesignRequestDto request) {

        WebAppFiles webAppFiles = previewCacheService.generateDesignPreview(request);

        return ResponseEntity.ok(webAppFiles.index_html());
    }

    @PostMapping("/generate/design")
    public ResponseEntity<Resource> generateDesignZip(
            @RequestBody DesignRequestDto request) {

        GeneratedUiDto result = imageToCodeService.generateFromDesign(request);

        Resource zipResource = new FileSystemResource(result.zipPath());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"generated-ui.zip\"")
                .body(zipResource);
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Backend API is running – image & design to HTML/zip ready";
    }
}