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

client.connect();

const limiterfast = rateLimit({
    windowMs: 60 * 1000,
	max: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req, res) => req.ip, // Use IP address to identify clients
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            message: 'Anda terlalu banyak melakukan permintaan. Silakan coba lagi nanti.'
        });
    },
	store: new RedisStore({
		sendCommand: (...args) => client.sendCommand(args),
	}),
})

module.exports = { limiterfast }