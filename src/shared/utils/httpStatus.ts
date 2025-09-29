export const HttpStatus = {
  // ✅ 2xx Success
  OK: 200, // Thành công chung (GET, PUT, PATCH, DELETE)
  CREATED: 201, // Tạo mới thành công (POST)
  ACCEPTED: 202, // Request chấp nhận nhưng xử lý async
  NO_CONTENT: 204, // Thành công nhưng không có dữ liệu trả về (DELETE)

  // ❌ 4xx Client Error
  BAD_REQUEST: 400, // Request sai (validation lỗi, thiếu field)
  UNAUTHORIZED: 401, // Chưa đăng nhập / token không hợp lệ
  FORBIDDEN: 403, // Không có quyền truy cập
  NOT_FOUND: 404, // Không tìm thấy resource
  METHOD_NOT_ALLOWED: 405, // Sai HTTP method
  CONFLICT: 409, // Dữ liệu conflict (vd: email đã tồn tại)
  GONE: 410, // Resource không còn tồn tại
  UNPROCESSABLE_ENTITY: 422, // Validation nâng cao (dữ liệu hợp lệ cú pháp nhưng sai logic)
  TOO_MANY_REQUESTS: 429, // Quá giới hạn request (rate limit)

  // 💥 5xx Server Error
  INTERNAL_SERVER_ERROR: 500, // Lỗi chung server
  NOT_IMPLEMENTED: 501, // API chưa implement
  BAD_GATEWAY: 502, // Proxy/gateway lỗi
  SERVICE_UNAVAILABLE: 503, // Server quá tải / bảo trì
  GATEWAY_TIMEOUT: 504, // Gateway timeout
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];
