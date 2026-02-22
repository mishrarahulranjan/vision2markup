package com.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Vision2MarkupStarterApplication {

    public static void main(String[] args) {
        SpringApplication.run(Vision2MarkupStarterApplication.class, args);
    }
}