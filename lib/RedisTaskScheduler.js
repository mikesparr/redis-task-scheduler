"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
var RedisTaskScheduler = (function () {
    function RedisTaskScheduler(config, client, channels) {
        this.DEFAULT_REDIS_HOST = "localhost";
        this.DEFAULT_REDIS_PORT = 6379;
        if (config && typeof config !== "object") {
            throw new TypeError("Config must be null or a valid RedisConfig");
        }
        if (client && typeof client !== "object") {
            throw new TypeError("Client must be null or a valid RedisClient");
        }
        if (client && client instanceof redis.RedisClient) {
            this.client = client;
        }
        else {
            var options = {
                host: config.host || this.DEFAULT_REDIS_HOST,
                port: config.port || this.DEFAULT_REDIS_PORT,
                retry_strategy: function (status) {
                    if (status.error && status.error.code === "ECONNREFUSED") {
                        return new Error("The server refused the connection");
                    }
                    if (status.total_retry_time > 1000 * 60 * 60) {
                        return new Error("Retry time exhausted");
                    }
                    if (status.attempt > 10) {
                        return undefined;
                    }
                    return Math.min(status.attempt * 100, 3000);
                },
            };
            if (config.db) {
                options.db = config.db;
            }
            if (config.password) {
                options.password = config.password;
            }
            this.client = redis.createClient(options);
        }
    }
    RedisTaskScheduler.prototype.schedule = function (job) {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    return RedisTaskScheduler;
}());
exports.default = RedisTaskScheduler;
//# sourceMappingURL=RedisTaskScheduler.js.map