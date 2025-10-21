# challenge-nodejs

Dự án thử thách học nodejs theo link https://www.youtube.com/watch?v=jR-n-cQnpNI&list=PLncHg6Kn2JT4smWdJceM0bDg4YUF3yqLu&index=1

🚀 Setup dự án với Sequelize + MySQL

1. Cài đặt dependencies
   npm install sequelize sequelize-cli mysql2 dotenv

2. Khởi tạo Sequelize
   npx sequelize-cli init

👉 Tạo ra các thư mục mặc định:

C:\Users\258056\Documents\namnh\chanllege\2025\challenge-nodejs\src\config\db.ts

C:\Users\258056\Documents\namnh\chanllege\2025\challenge-nodejs\src\infrastructure\db\sequelize\models\UserModel.ts

C:\Users\258056\Documents\namnh\chanllege\2025\challenge-nodejs\migrations\20250912073420-create-user.ts

C:\Users\258056\Documents\namnh\chanllege\2025\challenge-nodejs\seeders\userSeeder.ts

3. Tạo model + migration (ví dụ: User)
   npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string,role:string

👉 Sinh ra:

models/user.js

migrations/XXXXXXXXXXXXXX-create-user.js

4. Chạy migration
   npx sequelize-cli db:migrate
   npx ts-node ./migrations/20250912073420-create-user.ts
   npx sequelize-cli model:generate 
   --name UserTestModels 
   --attributes name:string,email:string,password:string,role:string

5. 👉 Tạo bảng Users trong DB.
👉 Table Sequelize tự động ghi log migration vào bảng SequelizeMeta.

5. Undo migration (xóa bảng User)
   npx sequelize-cli db:migrate:undo --name 20250912073420-create-user.js

6. Chạy lại migration
   npx sequelize-cli db:migrate
7. Build tạo thư mục dist
   npm run build
   tsc -p tsconfig.json


