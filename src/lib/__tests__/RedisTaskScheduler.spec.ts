import * as redis from "redis";

import IJob from "../IJob";
import ITask, { TaskType } from "../ITask";
import ITaskScheduler, { TaskChannel } from "../ITaskScheduler";
import Job from "../Job";
import RedisConfig from "../RedisConfig";
import RedisTaskScheduler from "../RedisTaskScheduler";
import Task from "../Task";

describe("RedisTaskScheduler", () => {
    const client: redis.RedisClient = redis.createClient();

    it("instantiates", () => {
        const result: ITaskScheduler = new RedisTaskScheduler(null, client);
        expect(result).toBeInstanceOf(RedisTaskScheduler);
    });

    it("publishes new job to database", (done) => {
        const scheduler: ITaskScheduler = new RedisTaskScheduler(null, client);

        const testTask: ITask = new Task(TaskType.PubSub, "myPubSubChannel", {foo: "bar"});
        const testJob: IJob = new Job(
            `job-${Date.now()}`,    // id
            testTask,               // task
            null,                   // lastRun
            5,                      // interval in minutes
            3,                      // recurrences
            0,                      // runCount
        );
        const testKey: string = [TaskChannel.Default, "jobs", "active"].join(":");

        // schedule it
        scheduler.schedule(TaskChannel.Default, testJob)
            .then(() => {
                // check job saved in datbase
                const testJobKey: string = [TaskChannel.Default, "job", testJob.getId()].join(":");

                client.zrank(testKey, testJobKey, (zrankErr: Error, reply: number) => {
                    if (zrankErr !== null) {
                        done.fail(zrankErr);
                    }

                    expect(reply).toBeGreaterThanOrEqual(0);
                    done();
                });
            })
            .catch((error) => {
                done.fail(error);
            });
    });
});
