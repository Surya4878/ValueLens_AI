package com.roicalculator.roiapp;

import tools.jackson.databind.JsonNode;

public class AIRequest {

    private String prompt;
    private JsonNode jsonInput;

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public JsonNode getJsonInput() {
        return jsonInput;
    }

    public void setJsonInput(JsonNode jsonInput) {
        this.jsonInput = jsonInput;
    }
}