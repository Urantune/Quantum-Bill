package quantum_bill.stock.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định từ hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Từ khóa không hợp lệ", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "Sai tài khoản hoặc mật khẩu", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Chưa xác thực", HttpStatus.UNAUTHORIZED),
    ROLE_NOT_EXISTED(1007, "Vai trò không tồn tại", HttpStatus.FORBIDDEN),
    USER_NOT_ACTIVE(1010, "Tài khoản chưa được kích hoạt hoặc đang chờ phê duyệt", HttpStatus.BAD_REQUEST),
    LOGIN_ERROR(1018, "Sai tài khoản hoặc mật khẩu", HttpStatus.UNAUTHORIZED),
    FORGOT_PASSWORD_EMAIL(1019, "Không tìm thấy email đăng ký", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1007, "Bạn không có quyền truy cập chức năng này", HttpStatus.FORBIDDEN);


    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
