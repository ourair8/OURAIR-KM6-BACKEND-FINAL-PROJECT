const { createClient } = require('redis');
const { RedisStore } = require('rate-limit-redis')
const rateLimit = require('express-rate-limit');

const client = createClient({
    password: 'soLWIYIfkr3Qad4hYLFTOLhBZGbAkp6I',
    socket: {
        host: 'redis-17803.c232.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 17803
    }
})


module.exports = { RedisStore, rateLimit, client }