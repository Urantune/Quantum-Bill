package quantum_bill.stock.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "INVALID KEY", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    ROLE_NOT_EXISTED(1007, "ROLE NOT EXISTED", HttpStatus.FORBIDDEN),
    USER_NOT_ACTIVE(1010, "Account not verify", HttpStatus.BAD_REQUEST),
    LOGIN_ERROR(1018, "Login Error", HttpStatus.UNAUTHORIZED),
    FORGOT_PASSWORD_EMAIL(1019, "Email not found", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN);


    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
