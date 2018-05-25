import IJob from "./IJob";

export enum TaskChannel {
    Default = "scheduler",
}

export default interface ITaskScheduler {
    schedule(channel: string, task: IJob): Promise<void>;
}
