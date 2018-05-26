# Redis Task Scheduler
This module schedules tasks that will be run 
with https://github.com/mikesparr/redis-docker-taskrunner

# Requirements
Redis must be installed and running, or accessible via network.

# Install
```bash
npm install redis-task-scheduler
yarn add redis-task-scheduler
```

# Test
Tests are in `src/__tests__` and `src/lib/__tests__` respectively. The app is built in 
Typescript but compiles to `.js` files.

```bash
npm test
npm run coverage # optional
```

# Usage
## Quick start (node)
```javascript
const redis = require("redis");
const rts = require("redis-task-scheduler");

const client = redis.createClient();
const scheduler = new rts.RedisTaskScheduler(null, client);

// create a job
const testTask = new rts.Task(rts.TaskType.PubSub, "myPubSubChannel", {foo: "bar"});
const testJob = new rts.Job(
    `job-${Date.now()}`,    // id
    testTask,               // task
    null,                   // lastRun
    5,                      // interval in minutes
    3,                      // recurrences
    0,                      // runCount
);

// schedule it
scheduler.schedule(rts.TaskChannel.Default, testJob)
    .then(() => {
        console.log("Job scheduled!");
    })
    .catch((error) => {
        console.error("Error: ", error);
    });
```

## Typescript
```typescript
import * as redis from "redis";
import {
    IJob,
    IRun,
    ITask,
    ITaskScheduler,
    Job,
    RedisTaskScheduler,
    Run,
    Task,
    TaskChannel,
    TaskType,
} from "redis-task-scheduler";

const client: redis.RedisClient = redis.createClient();
const scheduler: ITaskScheduler = new RedisTaskScheduler(null, client);

// create a job
const testTask: ITask = new Task(TaskType.PubSub, "myPubSubChannel", {foo: "bar"});
const testJob: IJob = new Job(
    `job-${Date.now()}`,    // id
    testTask,               // task
    null,                   // lastRun
    5,                      // interval in minutes
    3,                      // recurrences
    0,                      // runCount
);

// schedule it
scheduler.schedule(TaskChannel.Default, testJob)
    .then(() => {
        console.log("Job scheduled!");
    })
    .catch((error) => {
        console.error("Error: ", error);
    });
```

# Contributing
I haven't thought that far ahead. I needed this for my own project and decided to give back.

# License
MIT
