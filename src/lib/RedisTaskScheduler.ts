import * as redis from "redis";

import IJob from "./IJob";
import ITaskScheduler from "./ITaskScheduler";
import RedisConfig from "./RedisConfig";

interface IDictionary { [key: string]: any; }

export default class RedisTaskScheduler implements ITaskScheduler {
    protected client: redis.RedisClient;

    protected readonly DEFAULT_REDIS_HOST: string = "localhost";
    protected readonly DEFAULT_REDIS_PORT: number = 6379;

    constructor(config: RedisConfig, client?: redis.RedisClient, channels?: string[]) {
        if (config && typeof config !== "object") {
            throw new TypeError("Config must be null or a valid RedisConfig");
        }
        if (client && typeof client !== "object") {
            throw new TypeError("Client must be null or a valid RedisClient");
        }

        if (client && client instanceof redis.RedisClient) {
            this.client = client;
        } else {
            // build properties for instantiating Redis
            const options: IDictionary = {
                host: config.host || this.DEFAULT_REDIS_HOST,
                port: config.port || this.DEFAULT_REDIS_PORT,
                retry_strategy: (status: any) => {
                    if (status.error && status.error.code === "ECONNREFUSED") {
                        // End reconnecting on a specific error and flush all commands
                        return new Error("The server refused the connection");
                    }
                    if (status.total_retry_time > 1000 * 60 * 60) {
                        // End reconnecting after a specific timeout and flush all commands
                        return new Error("Retry time exhausted");
                    }
                    if (status.attempt > 10) {
                        // End reconnecting with built in error
                        return undefined;
                    }
                    // reconnect after
                    return Math.min(status.attempt * 100, 3000);
                },
            };
            if (config.db) { options.db = config.db; }
            if (config.password) { options.password = config.password; }

            this.client = redis.createClient(options);
        }
    } // constructor

    public schedule(job: IJob): Promise<void> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    } // schedule
}
