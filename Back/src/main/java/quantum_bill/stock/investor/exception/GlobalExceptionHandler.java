package quantum_bill.stock.investor.exception;

import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(ResourceNotFoundException ex) {
        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                HttpStatus.NOT_FOUND.getReasonPhrase()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String errorMessage = "Mã chứng khoán hoặc dữ liệu doanh nghiệp bị trùng lặp trên hệ thống!";

        Throwable rootCause = ex.getRootCause();
        if (rootCause instanceof java.sql.SQLException sqlEx) {
            if (sqlEx.getErrorCode() == 1062) {
                errorMessage = "Mã chứng khoán này đã tồn tại trên hệ thống! Vui lòng chọn mã khác.";
            } else {
                errorMessage = sqlEx.getMessage();
            }
        } else if (rootCause != null) {
            String rootMsg = rootCause.getMessage();
            if (rootMsg != null && (rootMsg.contains("Duplicate entry") || rootMsg.contains("1062"))) {
                errorMessage = "Mã chứng khoán này đã tồn tại trên hệ thống! Vui lòng chọn mã khác.";
            }
        }

        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                errorMessage,
                HttpStatus.BAD_REQUEST.getReasonPhrase()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

//    @ExceptionHandler(ExampleArtistException.class)
//    public ResponseEntity<ApiError> handleArtistException(ExampleArtistException ex) {
//        ApiError error = new ApiError(
//                LocalDateTime.now(),
//                HttpStatus.BAD_REQUEST.value(),
//                "Special validation failed for Artist 79",
//                HttpStatus.BAD_REQUEST.getReasonPhrase()
//        );
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
//    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDeniedException(AccessDeniedException ex) {
        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.FORBIDDEN.value(),
                "Access Denied: Bạn không có quyền thực hiện hành động này!",
                HttpStatus.FORBIDDEN.getReasonPhrase()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ApiError> handleBadRequest(RuntimeException ex) {
        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.getReasonPhrase()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));
        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                message,
                HttpStatus.BAD_REQUEST.getReasonPhrase()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneralException(Exception ex) {
        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}