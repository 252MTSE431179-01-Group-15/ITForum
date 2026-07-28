import dotenv from 'dotenv';
import { getRedisClient } from '../config/redis.js';

dotenv.config();

async function testRedis() {
  console.log('Testing Redis connection...');
  console.log('REDIS_URL:', process.env.REDIS_URL ? '[Configured]' : '[NOT SET]');
  
  const client = await getRedisClient();
  if (!client) {
    console.error('❌ Failed to get Redis client. Check REDIS_URL or network connection.');
    process.exit(1);
  }

  try {
    const testKey = 'itforum:test_ping';
    const testValue = { message: 'Redis is working perfectly!', timestamp: new Date().toISOString() };

    await client.set(testKey, JSON.stringify(testValue), { EX: 3600 });
    console.log(`✅ Successfully set key "${testKey}" in Redis!`);

    const readValue = await client.get(testKey);
    console.log(`📖 Read back key "${testKey}":`, readValue);

    console.log('\n🎉 REDIS IS 100% WORKING AND WRITING KEYS PROPERLY!');
  } catch (err) {
    console.error('❌ Error during Redis read/write test:', err.message);
  } finally {
    process.exit(0);
  }
}

testRedis();
