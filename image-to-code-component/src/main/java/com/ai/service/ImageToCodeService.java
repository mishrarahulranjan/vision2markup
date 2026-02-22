package com.ai.service;

import com.ai.dto.DesignRequestDto;
import com.ai.dto.GeneratedUiDto;
import com.ai.dto.WebAppFiles;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ImageToCodeService {

    private final PreviewCacheService previewCacheService;
    private final UiBundleService uiBundleService;

    public GeneratedUiDto generateFromImage(MultipartFile file, String style) throws IOException {
        WebAppFiles files = previewCacheService.generateImagePreview(file, style);
        return  uiBundleService.createBundle(files, file.getOriginalFilename());
    }

    public GeneratedUiDto generateFromDesign(DesignRequestDto request) {
        WebAppFiles files = previewCacheService.generateDesignPreview(request);
        return uiBundleService.createBundle(files, "generated-design");
    }
}