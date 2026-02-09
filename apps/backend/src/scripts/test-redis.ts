// Test Redis Cloud Connection
// Run: npx ts-node src/scripts/test-redis.ts

import { redis } from '../services/redis.service';

async function testRedisConnection() {
    console.log('🔄 Testing Redis Cloud connection...\n');

    try {
        // Test connection
        const isHealthy = await redis.testConnection();

        if (isHealthy) {
            console.log('✅ Redis Cloud connection successful!\n');

            // Test SDUI caching
            const testData = JSON.stringify({
                components: [{ id: 'test', type: 'Container' }],
                timestamp: new Date().toISOString()
            });

            console.log('📦 Testing SDUI cache operations...');

            // Set with TTL
            await redis.setex('test:sdui:home', 60, testData);
            console.log('   SET test:sdui:home ✓');

            // Get
            const result = await redis.get('test:sdui:home');
            console.log('   GET test:sdui:home ✓');
            console.log('   Value:', result?.substring(0, 50) + '...');

            // Delete
            await redis.del('test:sdui:home');
            console.log('   DEL test:sdui:home ✓');

            console.log('\n✅ All Redis operations successful!');
            console.log('   Ready for SDUI caching.\n');

        } else {
            console.log('❌ Redis connection failed');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await redis.disconnect();
        process.exit(0);
    }
}

testRedisConnection();
