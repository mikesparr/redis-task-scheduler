import IJob from "./IJob";
import IRun from "./IRun";
import ITask from "./ITask";
import Run from "./Run";
export default class Job implements IJob {
    protected id: string;
    protected task: ITask;
    protected lastRun: IRun;
    protected interval: number;
    protected recurrences: number;
    protected runCount: number;
    constructor(id?: string, task?: ITask, lastRun?: IRun, intervalInMinutes?: number, recurrences?: number, runCount?: number);
    getId(): string;
    setId(id: string): IJob;
    getTask(): ITask;
    setTask(task: ITask): IJob;
    getLastRun(): IRun;
    setLastRun(lastRun: Run): IJob;
    getIntervalInMinutes(): number;
    setIntervalInMinutes(interval: number): IJob;
    getRecurrences(): number;
    setRecurrences(recurrences: number): IJob;
    getRunCount(): number;
    setRunCount(count: number): IJob;
    fromDict(obj: {
        [key: string]: any;
    }): IJob;
    toDict(): {
        [key: string]: any;
    };
}
