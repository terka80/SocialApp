"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = exports.CacheService = void 0;
const config_1 = require("./../../config");
const redis_1 = require("redis");
class CacheService {
    client;
    constructor() {
        this.client = (0, redis_1.createClient)({ url: config_1.REDIS_URI });
        this.connect();
    }
    async connect() {
        try {
            await this.client.connect();
            console.log(` REDIS CONNECTED `);
        }
        catch (error) {
            console.log(`Fail on redis connection  `);
        }
    }
    async setCache({ key, value, ttl = undefined, }) {
        if (typeof value == "object") {
            value = JSON.stringify(value);
        }
        return await this.client.set(key, value, { ...(ttl ? { EX: ttl } : {}) });
    }
    async getCache({ key }) {
        let value = await this.client.get(key);
        try {
            return JSON.parse(value);
        }
        catch (error) {
            return value;
        }
    }
    async existCache({ key }) {
        return await this.client.exists(key);
    }
    async updateCache({ key, value, ttl = undefined, }) {
        if (!(await this.existCache({ key }))) {
            return 0;
        }
        return this.setCache({ key, value, ttl });
    }
    async deleteCache({ key, }) {
        return await this.client.del(key);
    }
    async keysCache({ prefix }) {
        return await this.client.keys(`${prefix}*`);
    }
    async ttlCache({ key }) {
        return await this.client.ttl(key);
    }
    async expireCache({ key, ttl }) {
        return await this.client.expire(key, ttl);
    }
    async incrementByCache({ key, value = 1, }) {
        return await this.client.incrBy(key, value);
    }
}
exports.CacheService = CacheService;
exports.cacheService = new CacheService();
