# challenge-nodejs
Dự án thử thách học nodejs theo link https://www.youtube.com/watch?v=jR-n-cQnpNI&list=PLncHg6Kn2JT4smWdJceM0bDg4YUF3yqLu&index=1

🚀 Setup dự án với Sequelize + MySQL
1. Cài đặt dependencies
   npm install sequelize sequelize-cli mysql2 dotenv

2. Khởi tạo Sequelize
   npx sequelize-cli init


👉 Tạo ra các thư mục mặc định:

config/config.js

models/

migrations/

seeders/

3. Tạo model + migration (ví dụ: User)
   npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string,role:string


👉 Sinh ra:

models/user.js

migrations/XXXXXXXXXXXXXX-create-user.js

4. Chạy migration
   npx sequelize-cli db:migrate


👉 Tạo bảng Users trong DB.
👉 Sequelize tự động ghi log migration vào bảng SequelizeMeta.

5. Undo migration (xóa bảng User)
   npx sequelize-cli db:migrate:undo --name 20250912073420-create-user.js

6. Chạy lại migration
   npx sequelize-cli db:migrate