(Presentation → Application → Domain → Infrastructure) rồi quay ngược lại, kèm theo các nhánh lỗi.

Bức tranh tổng quát (Layered + DDD-lite)
Luồng: HTTP Request
→ Express Route (userV2Routes)
→ Controller (UserControllerV2)
→ Use Case (CreateUserUseCase)
→ Repository (IUserRepository interface + InMemoryUserRepository implementation)
→ Domain Entity (User)
→ Trả kết quả về Controller
→ Mapper (userMapper) để tạo DTO trả ra
→ Response JSON
→ (Nếu có lỗi) ném BaseError → errorHandler → chuẩn hóa JSON error.

Tách thế này để:

Thay đổi hạ tầng (DB, cache) mà không động logic nghiệp vụ.
Đơn vị test gọn (test use case không cần Express).
Domain không “nhiễm” chi tiết framework.
Cấu hình DI sau này chỉ thay wiring.
Chi tiết từng file & vai trò
(1) src/presentation/http/routes/userV2Routes.ts

Nhiệm vụ: Khai báo endpoint /v2/users và gắn controller.create cho method POST.
Không chứa logic nghiệp vụ; chỉ “điểm vào HTTP”.
Tại sao tách riêng: dễ quét/đọc tất cả routes, dễ versioning (v2), thu gọn app.ts.
(2) src/presentation/http/controllers/UserControllerV2.ts

Vai trò: Nhận Request, gọi Use Case, chuyển kết quả sang DTO, gửi Response.
Không tự xử lý nghiệp vụ (không tự validate sâu, không tạo entity trực tiếp).
Bắt lỗi bằng try/catch và next(err) để errorHandler xử lý thống nhất.
Tách controller giúp test: có thể mock Use Case.
(3) src/application/user/CreateUserUseCase.ts

“Trái tim” của hành động nghiệp vụ “tạo user”.
Chứa quy tắc: email + name bắt buộc, email không trùng.
Sinh ID (tạm thời) + tạo domain entity User + giao repository lưu.
Throw ValidationError hoặc ConflictError nếu không đạt.
Tại sao cần lớp riêng:
Dễ test thuần (không framework).
Dễ mở rộng thêm logic (gửi email, audit log, publish event…).
Giữ “Use Case = hành động của ngôn ngữ nghiệp vụ”.
(4) src/domain/user/User.ts

Domain Entity biểu diễn khái niệm cốt lõi User trong hệ thống.
Quản lý state & đảm bảo invariant nội bộ (sau này bạn có thể thêm validate email format, cập nhật status, vv.).
Phương thức create và rehydrate:
create: dùng cho use case tạo mới.
rehydrate: dùng để tái tạo từ dữ liệu DB (khi implement repo thực).
toObject: trả snapshot an toàn (copy) để tránh sửa trực tiếp.
(5) src/domain/user/IUserRepository.ts

Interface mô tả các thao tác mà Application Layer cần với nguồn dữ liệu user (findByEmail, add).
Application và Domain chỉ biết interface này – không biết InMemory hay Sequelize.
Lợi ích: Inversion of Dependency. Thay backend dữ liệu không sửa use case.
(6) src/infrastructure/repositories/inMemory/InMemoryUserRepository.ts

Cài đặt cụ thể của IUserRepository bằng mảng trong bộ nhớ.
Chỉ phục vụ giai đoạn sớm / test / prototyping.
Sau này bạn thêm: SequelizeUserRepository (trong infrastructure/db/sequelize/...).
Tách hạ tầng ra khỏi domain để domain vẫn “sạch”.
(7) src/presentation/http/mappers/userMapper.ts

Mapper chuyển Domain Entity → DTO trả về client.
Lý do:
Tránh lộ trường nội bộ (createdAt, updatedAt nếu chưa cần).
Sau này nếu cần đổi format (ví dụ: status chuyển thành camelCase hoặc thêm meta) không phải sửa controller lẫn domain.
Dễ tái dùng cho nhiều endpoint.
(8) src/shared/errors/BaseError.ts (+ ValidationError, ConflictError, ...)

Chuẩn hóa cơ chế lỗi: có code, status, message.
Controller / UseCase chỉ throw subclass → errorHandler dựa vào instanceof để format JSON.
Lợi ích: tránh lộn xộn kiểu lúc thì throw string, lúc Error thường.
(9) src/presentation/http/middleware/errorHandler.ts

Middleware cuối cùng bắt mọi lỗi đẩy ra từ controller hoặc use case.
Chuyển về JSON thống nhất: { success:false, error:{ code, message } }.
Giảm duplication (không cần try/catch và res.status nhiều nơi).
Dễ logging, gắn tracing sau này (chỉ sửa 1 file).
(10) src/app.ts

Tập hợp / “đăng ký” routes + middleware.
Không chứa server.listen (chia tách để test supertest với app trực tiếp).
Trình tự quan trọng:
app.use(json) → app.use('/v2/users', userV2Routes) → app.use(errorHandler)
(11) src/server.ts

Bootstrap thực thi (listen port).
Lý do tách: test có thể import app và không khởi động cổng thật.
Request Flow cụ thể (Happy Path)
POST /v2/users
Body: { "email": "a@test.com", "name": "User A" }

Express nhận request → khớp prefix /v2/users → userV2Routes.
userV2Routes định nghĩa POST '/' → gọi userController.create.
Controller: lấy req.body → gọi createUserUseCase.execute().
Use Case:
Validate thiếu trường? (nếu thiếu → throw ValidationError)
repo.findByEmail(email) → hiện trả null (chưa có)
Tạo id (crypto.randomUUID)
User.create(...) → trả Entity User
repo.add(user) → push vào mảng
return user
Controller nhận entity → mapper userToDTO → trả res.status(201).json({ success:true, data: dto }).
Không có lỗi → errorHandler không tham gia.
Lưu đồ lỗi – ví dụ email trùng
1–3 giống trên.
4. Use Case: repo.findByEmail → tìm thấy user cùng email → throw new ConflictError('Email already exists').
5. Controller bắt trong try/catch → next(err).
6. errorHandler nhận err (instanceof BaseError true) → res.status(409).json({ success:false, error:{ code:'CONFLICT', message:'Email already exists' } }).
7. Client nhận JSON chuẩn.

Vì sao không gộp bớt file cho “nhanh”?
Bạn có thể đặt hết vào 1 file, nhưng sẽ đánh mất:

Tính tách lớp: không thay repository mà không sửa use case.
Dễ test (unit test CreateUserUseCase độc lập).
Scalability: khi số use case tăng (CreateUser, UpdateUserStatus, DeactivateUser...), mỗi use case tự lập file.
Clean diff: review PR dễ – chỉnh sửa 1 nhỏ không đụng file “God file”.
Dễ áp dụng DI container (Awilix / Tsyringe) sau này.
Khi chuyển sang Repository thật (Sequelize) – Ảnh hưởng lớp nào?
Chỉ tạo thêm: SequelizeUserRepository implements IUserRepository.

Use Case không đổi.
Controller không đổi.
Domain entity không đổi.
Route chỉ chỉnh wiring (thay new InMemoryUserRepository() bằng new SequelizeUserRepository(model)).
→ Chứng minh kiến trúc tách đúng.
Mô phỏng chuỗi gọi (pseudo call stack)
(Valid request) app.ts
→ userV2Routes.ts (router.post)
→ UserControllerV2.create(req,res,next)
→ CreateUserUseCase.execute(input)
→ InMemoryUserRepository.findByEmail(email)
← null
→ User.create(...)
→ InMemoryUserRepository.add(user)
← (void)
← User entity
→ userToDTO(user)
← res.json(...)

(Error request – duplicate) ...
→ CreateUserUseCase.execute
→ repo.findByEmail → User tồn tại
→ throw ConflictError
Controller catch → next(err)
errorHandler(err,req,res,next)
→ instanceof BaseError ? yes
→ res.status(err.status).json(...)

Góc nhìn Test Strategy (vì sao chia lớp giúp test)
Unit test Use Case: mock IUserRepository → kiểm tra throw Conflict khi repo trả user.
Unit test Controller: mock use case (trả entity giả) → đảm bảo status 201 & format JSON.
Integration test route: dùng supertest gọi /v2/users trong memory (app.ts).
Không cần khởi động DB cho test logic validate.
Những mở rộng tự nhiên tiếp theo
Thêm UpdateUserNameUseCase.
Thêm UserRepositorySequelize thay InMemory.
Thêm GET /v2/users/:id → repo.findById (cập nhật interface).
Event publishing (UserCreatedEvent) từ use case → message bus (domain event pattern).
Mapper 2 chiều (DTO → Command input) nếu format request phức tạp.
Checklist để chắc kiến trúc đang “đúng hướng”
Domain không import từ infrastructure hoặc express.
Application không import từ express.
Presentation không truy cập trực tiếp mảng hoặc model DB.
Mọi lỗi nghiệp vụ throw subclass BaseError.
Thay repository (InMemory → DB) không sửa use case code.
Nếu muốn rút gọn cho project rất nhỏ?
Bạn có thể gộp CreateUserUseCase + InMemoryRepo vào 1 file. Tuy nhiên khi scale sẽ phải refactor lại – tốn công hơn. Giữ phân tách ngay từ đầu giúp transition nhẹ nhàng khi tính năng tăng.

Tóm tắt siêu ngắn
Route định nghĩa endpoint
→ Controller nhận request, gọi Use Case
→ Use Case xử lý nghiệp vụ thuần với Repository abstraction
→ Repository thực thi lưu/tìm trong storage cụ thể
→ Domain Entity đảm bảo cấu trúc & future rules
→ Mapper tạo DTO sạch
→ Error dùng BaseError + middleware để thống nhất output.