const { createClient } = require('redis');
const { RedisStore } = require('rate-limit-redis')
const rateLimit = require('express-rate-limit');

const client = createClient({
    password: 'soLWIYIfkr3Qad4hYLFTOLhBZGbAkp6I',
    socket: {
        tls : {
            
        },
        host: 'redis-17803.c232.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 17803,
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                return new Error('Too many retries');
            }
            return 100;
        },
        keepAlive: true,
        timeout: 60000 
    }
});
module.exports = { RedisStore, rateLimit, client }