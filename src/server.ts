import app from "./app";
// @ts-ignore
import sequelize from "./config/db";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
