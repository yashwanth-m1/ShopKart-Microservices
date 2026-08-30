import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error.message);
});

redisClient.on("connect", () => {
  console.log("Connecting to Redis Cloud...");
});

redisClient.on("ready", () => {
  console.log("Redis Cloud connected successfully");
});

redisClient.on("reconnecting", () => {
  console.log("Reconnecting to Redis Cloud...");
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error(
      "Redis connection failed:",
      error.message
    );

    process.exit(1);
  }
};

export default redisClient;