package com.ai.util;

import org.zeroturnaround.zip.ZipUtil;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Simple utility to create a ZIP file containing the generated HTML.
 */
public final class ZipGenerator {

    private ZipGenerator() {
        // utility class - no instances
    }

    public static String createZipWithHtml(String htmlContent, String originalFilename) throws IOException {

        Path tempDir = Files.createTempDirectory("ui-generated-");

        Path htmlPath = tempDir.resolve("index.html");
        Files.writeString(htmlPath, htmlContent);

        String zipName = "generated-ui-" + (originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_") : "ui") + ".zip";
        Path zipPath = Files.createTempFile("ui-zip-", ".zip");

        ZipUtil.packEntry(htmlPath.toFile());

        Files.deleteIfExists(htmlPath);

        return zipPath.toAbsolutePath().toString();
    }
}