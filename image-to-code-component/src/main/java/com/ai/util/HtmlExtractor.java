package com.ai.util;

public class HtmlExtractor {

    public static String extractCleanHtml(String response) {

        if (response == null) {
            return "";
        }

        response = response.replaceAll("```html", "")
                           .replaceAll("```", "")
                           .trim();

        if (!response.toLowerCase().contains("<html")) {
            throw new IllegalArgumentException("No valid HTML found in LLM response.");
        }

        return response;
    }
}