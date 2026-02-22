package com.ai.dto;

import java.util.List;

public record DesignRequestDto(
        List<BlockDto> blocks,
        String style
) {}