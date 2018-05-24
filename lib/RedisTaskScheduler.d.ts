import * as redis from "redis";
import IJob from "./IJob";
import ITaskScheduler from "./ITaskScheduler";
import RedisConfig from "./RedisConfig";
export default class RedisTaskScheduler implements ITaskScheduler {
    protected client: redis.RedisClient;
    protected readonly DEFAULT_REDIS_HOST: string;
    protected readonly DEFAULT_REDIS_PORT: number;
    constructor(config: RedisConfig, client?: redis.RedisClient, channels?: string[]);
    schedule(job: IJob): Promise<void>;
}
