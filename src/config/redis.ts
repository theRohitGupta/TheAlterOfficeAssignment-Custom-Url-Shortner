import { createClient, RedisClientType } from 'redis';

class RedisClient {
  private static instance: RedisClientType;
  private static isInitialized: boolean = false;

  public static async getInstance(): Promise<RedisClientType> {
    if (!this.instance) {
      this.instance = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });

      this.instance.on('error', (error) => {
        console.error('Redis Client Error:', error);
      });

      this.instance.on('connect', () => {
        console.log('Redis Client Connected');
      });

      await this.instance.connect();
      this.isInitialized = true;
    }

    return this.instance;
  }

  public static async disconnect(): Promise<void> {
    if (this.isInitialized && this.instance) {
      await this.instance.disconnect();
      this.isInitialized = false;
    }
  }

  // Utility method for caching with expiration
  public static async setWithExpiry(
    key: string, 
    value: any, 
    expirySeconds: number = 3600
  ): Promise<void> {
    const client = await this.getInstance();
    await client.setEx(key, expirySeconds, JSON.stringify(value));
  }

  // Utility method for retrieving cached data
  public static async get<T>(key: string): Promise<T | null> {
    const client = await this.getInstance();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }
}

export default RedisClient;