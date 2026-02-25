package com.ai.service;

import com.ai.dto.DesignRequestDto;
import com.ai.dto.WebAppFiles;
import com.ai.service.llm.LlmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class PreviewCacheService {

    private final LlmService llmService;

    @Cacheable(value = "htmlPreviewCache",
            key = "#root.args[0].originalFilename + '_' + #style")
    public WebAppFiles generateImagePreview(MultipartFile file, String style) throws IOException {
        log.info("call to generateImagePreview");
        return llmService.generateCodeFromImage(
                file.getBytes(),
                file.getContentType(),
                style
        );
    }

    @Cacheable(value = "htmlPreviewCache",
            key = "'design_' + T(java.util.Objects).hashCode(#request)")
    public WebAppFiles generateDesignPreview(DesignRequestDto request) {
        log.info("call to generateDesignPreview");
        return llmService.generateCodeFromDesign(request);
    }
}