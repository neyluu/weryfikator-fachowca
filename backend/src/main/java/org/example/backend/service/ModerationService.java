package org.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ModerationService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${AI_DISABLED}")
    private Boolean aiDisabled;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean isProfane(String text) {
        if(aiDisabled) return false;

        if (text == null || text.trim().isEmpty()) {
            return false;
        }
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", "Czy poniższy tekst zawiera wulgaryzmy lub jest niecenzuralny? Odpowiedz tylko słowem 'TAK' lub 'NIE'. Tekst: " + text)
                        ))
                )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            Map response = restTemplate.postForObject(url, request, Map.class);
            
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                String reply = parts.get(0).get("text").trim();
                
                return reply.toUpperCase().contains("TAK");
            }
            return false;
        } catch (HttpClientErrorException e) {
            throw new IllegalArgumentException("Błąd API Gemini: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new IllegalArgumentException("Błąd weryfikacji tekstu: " + e.getMessage());
        }
    }
}