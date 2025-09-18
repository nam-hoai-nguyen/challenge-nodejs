# Architecture Overview (Phase 1 Skeleton)

Mục tiêu: Tách dần từ MVC sang Layered (Presentation → Application → Domain, và Infrastructure cung cấp triển khai kỹ thuật).

Tầng:
- presentation: Controller, route, middleware, mapper (không chứa business logic)
- application: Use case (điều phối, gọi repository interface, transaction sau này)
- domain: Entity thuần, rule nghiệp vụ, không phụ thuộc framework
- infrastructure: ORM (Sequelize), adapter (email, cache...), triển khai repository

Quy tắc phụ thuộc (chỉ một chiều):
presentation → application → domain
application → domain (và interface repository)
infrastructure → domain (cung cấp implementation)

Hiện tại: CHƯA chuyển code. Đây chỉ là skeleton để các bước sau di chuyển dần.