import IJob from "./IJob";

export default interface ITaskScheduler {
    schedule(task: IJob): Promise<void>;
}
