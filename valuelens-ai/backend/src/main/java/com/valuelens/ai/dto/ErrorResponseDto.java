package com.valuelens.ai.dto;

import java.util.List;

public class ErrorResponseDto {

    private boolean success = false;
    private ErrorDetail error;

    public ErrorResponseDto() {}

    public ErrorResponseDto(String code, String message, List<String> details) {
        this.success = false;
        this.error = new ErrorDetail(code, message, details);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public ErrorDetail getError() { return error; }
    public void setError(ErrorDetail error) { this.error = error; }

    public static class ErrorDetail {
        private String code;
        private String message;
        private List<String> details;

        public ErrorDetail() {}

        public ErrorDetail(String code, String message, List<String> details) {
            this.code = code;
            this.message = message;
            this.details = details;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public List<String> getDetails() { return details; }
        public void setDetails(List<String> details) { this.details = details; }
    }
}
