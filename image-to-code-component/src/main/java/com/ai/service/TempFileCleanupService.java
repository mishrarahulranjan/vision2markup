package com.ai.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TempFileCleanupService {

    private final Map<Path, Instant> tempFiles = new ConcurrentHashMap<>();

    public void registerTempFile(Path path) {
        tempFiles.put(path, Instant.now());
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void cleanupOldFiles() {
        Instant now = Instant.now();
        tempFiles.forEach((path, createdTime) -> {
            if (createdTime.plusSeconds(10 * 60).isBefore(now)) { // 10 min TTL
                try {
                    File file = path.toFile();
                    if (file.exists()) file.delete();
                    tempFiles.remove(path);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
}