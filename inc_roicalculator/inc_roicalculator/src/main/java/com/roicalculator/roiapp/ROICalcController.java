package com.roicalculator.roiapp;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RestController
@RequestMapping("/api")
public class ROICalcController {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Logger log =
            LoggerFactory.getLogger(ROICalcController.class);

    @Value("${api.key}")
    private String apiKey;

    @PostMapping("/calculateROI")
    public ResponseEntity<APIResponse> calculateROI(
            @RequestBody AIRequest aiRequest) {

        log.info("Received ROI calculation request");

        try {


            // 1. Validate API key

            if (apiKey == null || apiKey.isBlank()) {

                log.error("API key is not configured");

                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new APIResponse(
                                false,
                                "API key is not configured",
                                null
                        ));
            }


            // 2. Validate request body

            if (aiRequest == null) {

                log.warn("Request body is empty");

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new APIResponse(
                                false,
                                "Request cannot be empty",
                                null
                        ));
            }


            // 3. Validate prompt

            if (aiRequest.getPrompt() == null ||
                    aiRequest.getPrompt().isBlank()) {

                log.warn("Prompt is missing");

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new APIResponse(
                                false,
                                "Prompt cannot be empty",
                                null
                        ));
            }


            // 4. Validate JSON input

            if (aiRequest.getJsonInput() == null ||
                    aiRequest.getJsonInput().isNull()) {

                log.warn("jsonInput is missing");

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new APIResponse(
                                false,
                                "jsonInput cannot be empty",
                                null
                        ));
            }

            String prompt = aiRequest.getPrompt();
            JsonNode jsonInput = aiRequest.getJsonInput();

            log.debug("Sending request to LLM API");


            // 5. Build NVIDIA request

            ObjectNode nvidiaRequest =
                    objectMapper.createObjectNode();

            nvidiaRequest.put(
                    "model",
                    "nvidia/nemotron-3-super-120b-a12b"
            );

            ArrayNode messages =
                    nvidiaRequest.putArray("messages");

            // System message
            ObjectNode systemMessage =
                    messages.addObject();

            systemMessage.put("role", "system");

            systemMessage.put(
                    "content",
                    prompt
            );

            // User message
            ObjectNode userMessage =
                    messages.addObject();

            userMessage.put("role", "user");

            /*
             * Convert JsonNode to a JSON string.
             *
             * NVIDIA Chat Completions expects message content
             * to be text rather than a raw JSON object.
             */
            userMessage.put(
                    "content",
                    objectMapper.writeValueAsString(jsonInput)
            );

            nvidiaRequest.put(
                    "temperature",
                    0.1
            );

            nvidiaRequest.put(
                    "stream",
                    false
            );

            String requestBody =
                    objectMapper.writeValueAsString(
                            nvidiaRequest
                    );


            // 6. Build HTTP request

            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(URI.create(
                                    "https://integrate.api.nvidia.com/v1/chat/completions"
                            ))
                            .header(
                                    "Authorization",
                                    "Bearer " + apiKey
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers.ofString(
                                            requestBody
                                    )
                            )
                            .build();


            // 7. Call NVIDIA API

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            log.info(
                    "LLM API response status: {}",
                    response.statusCode()
            );


            // 8. Handle NVIDIA API errors

            if (response.statusCode() < 200 ||
                    response.statusCode() >= 300) {

                log.error(
                        "LLM returned error. Status: {}, Response: {}",
                        response.statusCode(),
                        response.body()
                );

                return ResponseEntity
                        .status(HttpStatus.BAD_GATEWAY)
                        .body(new APIResponse(
                                false,
                                "AI service returned an error",
                                null
                        ));
            }


            // 9. Parse NVIDIA response

            JsonNode root;

            try {

                root = objectMapper.readTree(
                        response.body()
                );

            } catch (Exception e) {

                log.error(
                        "Failed to parse LLM API response",
                        e
                );

                return ResponseEntity
                        .status(HttpStatus.BAD_GATEWAY)
                        .body(new APIResponse(
                                false,
                                "Invalid response received from AI service",
                                null
                        ));
            }


            // 10. Extract AI response

            JsonNode contentNode =
                    root
                            .path("choices")
                            .path(0)
                            .path("message")
                            .path("content");

            if (contentNode.isMissingNode() ||
                    contentNode.isNull() ||
                    contentNode.asText().isBlank()) {

                log.error(
                        "AI response does not contain expected message content"
                );

                return ResponseEntity
                        .status(HttpStatus.BAD_GATEWAY)
                        .body(new APIResponse(
                                false,
                                "AI service returned an unexpected response",
                                null
                        ));
            }

            String answer =
                    contentNode.asText();

            log.info(
                    "ROI calculation completed successfully"
            );


            // 11. Successful response

            return ResponseEntity.ok(
                    new APIResponse(
                            true,
                            "ROI calculation completed successfully",
                            answer
                    )
            );

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            log.error(
                    "Request to LLM API was interrupted",
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse(
                            false,
                            "AI service request was interrupted",
                            null
                    ));

        } catch (Exception e) {

            log.error(
                    "Unexpected error while processing request",
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse(
                            false,
                            "An unexpected error occurred",
                            null
                    ));
        }
    }
}