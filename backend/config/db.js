const mongoose = require("mongoose");

async function connectDB() {
  // Без MONGO_URI поднимаем временную in-memory MongoDB (данные сотрутся при перезапуске)
  let uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn(
      "⚠️  MONGO_URI не задан — используется in-memory MongoDB (данные пропадут после перезапуска)"
    );
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri("kinopro");
  }

  try {
    await mongoose.connect(uri);
    console.log("📦 MongoDB connected:", uri.split("@").pop() || uri);
  } catch (err) {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
