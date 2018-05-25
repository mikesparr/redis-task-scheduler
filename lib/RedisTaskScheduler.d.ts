import * as redis from "redis";
import IJob from "./IJob";
import ITaskScheduler from "./ITaskScheduler";
import RedisConfig from "./RedisConfig";
export default class RedisTaskScheduler implements ITaskScheduler {
    protected client: redis.RedisClient;
    protected readonly DEFAULT_REDIS_HOST: string;
    protected readonly DEFAULT_REDIS_PORT: number;
    protected readonly REDIS_JOBS_TYPE: string;
    protected readonly REDIS_JOB_TYPE: string;
    protected readonly REDIS_JOB_STATUS: string;
    constructor(config: RedisConfig, client?: redis.RedisClient);
    schedule(channel: string, job: IJob): Promise<void>;
    protected generateJobScore(intervalInMinutes: number): number;
    protected getJobsKey(channel: string): string;
    protected getJobKey(channel: string, job: IJob): string;
}
