"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
var RedisTaskScheduler = (function () {
    function RedisTaskScheduler(config, client) {
        this.DEFAULT_REDIS_HOST = "localhost";
        this.DEFAULT_REDIS_PORT = 6379;
        this.REDIS_JOBS_TYPE = "jobs";
        this.REDIS_JOB_TYPE = "job";
        this.REDIS_JOB_STATUS = "active";
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
    RedisTaskScheduler.prototype.schedule = function (channel, job) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var jobChannel = _this.getJobsKey(channel);
            var score = _this.generateJobScore(job.getIntervalInMinutes());
            var jobKey = _this.getJobKey(channel, job);
            _this.client.multi()
                .zadd(jobChannel, score, jobKey)
                .set(jobKey, JSON.stringify(job.toDict()))
                .exec(function (scheduleErr, replies) {
                if (scheduleErr !== null) {
                    reject(scheduleErr);
                }
                resolve();
            });
        });
    };
    RedisTaskScheduler.prototype.generateJobScore = function (intervalInMinutes) {
        var intervalInMillis = intervalInMinutes * (60 * 1000);
        return Math.floor(Date.now() / 1000) + intervalInMillis;
    };
    RedisTaskScheduler.prototype.getJobsKey = function (channel) {
        return [channel, this.REDIS_JOBS_TYPE, this.REDIS_JOB_STATUS].join(":");
    };
    RedisTaskScheduler.prototype.getJobKey = function (channel, job) {
        return [channel, this.REDIS_JOB_TYPE, job.getId()].join(":");
    };
    return RedisTaskScheduler;
}());
exports.default = RedisTaskScheduler;
//# sourceMappingURL=RedisTaskScheduler.js.map