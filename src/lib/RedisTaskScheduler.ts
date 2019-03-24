import * as redis from "redis";

import IJob from "./IJob";
import ITaskScheduler from "./ITaskScheduler";
import RedisConfig from "./RedisConfig";

interface IDictionary { [key: string]: any; }

export default class RedisTaskScheduler implements ITaskScheduler {
    protected client: redis.RedisClient;
    protected config: RedisConfig;

    protected readonly DEFAULT_REDIS_HOST: string = "localhost";
    protected readonly DEFAULT_REDIS_PORT: number = 6379;
    protected readonly REDIS_JOBS_TYPE: string = "jobs";
    protected readonly REDIS_JOB_TYPE: string = "job";
    protected readonly REDIS_JOB_STATUS: string = "active";

    constructor(config: RedisConfig, client?: redis.RedisClient) {
        if (config && typeof config !== "object") {
            throw new TypeError("Config must be null or a valid RedisConfig");
        }
        if (client && typeof client !== "object") {
            throw new TypeError("Client must be null or a valid RedisClient");
        }

        if (client && client instanceof redis.RedisClient) {
            this.client = client;
        } else {
            this.config = config;
            this.client = this.getClient(config);

            this.client.on("error", (err) => {
                /* tslint:disable:no-console */
                console.error("Error " + err);
                /* tslint:enable:no-console */
            });
        }
    } // constructor

    public schedule(channel: string, job: IJob): Promise<void> {
        return new Promise((resolve, reject) => {
            const jobChannel: string = this.getJobsKey(channel);
            const score: number = this.generateJobScore(job.getIntervalInMinutes());
            const jobKey: string = this.getJobKey(channel, job);

            /* tslint:disable:no-console */
            console.log(`Scheduling new task ${channel}:${score}:${jobKey}`);

            this.client.multi()
                .zadd(jobChannel, score, jobKey)
                .set(jobKey, JSON.stringify(job.toDict()))
                .exec((scheduleErr: Error, replies: string[]) => {
                    if (scheduleErr !== null) {
                        console.log(`Error scheduling task task ${scheduleErr.message}`);
                        reject(scheduleErr);
                    }

                    console.log(`Scheduled task`);
                    /* tslint:enable:no-console */

                    resolve();
                });
        }); // Promise
    } // schedule

    protected getClient(config: RedisConfig): redis.RedisClient {
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

        return redis.createClient(options);
    }

    protected generateJobScore(intervalInMinutes: number): number {
        const intervalInMillis: number = intervalInMinutes * (60 * 1000);

        return Math.floor(Date.now() / 1000) + intervalInMillis;
    }

    protected getJobsKey(channel: string): string {
        return [channel, this.REDIS_JOBS_TYPE, this.REDIS_JOB_STATUS].join(":");
    }

    protected getJobKey(channel: string, job: IJob): string {
        return [channel, this.REDIS_JOB_TYPE, job.getId()].join(":");
    }
}
