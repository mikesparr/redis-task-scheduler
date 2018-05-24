import ITask, { TaskType } from "./ITask";
export default class Task implements ITask {
    protected type: TaskType;
    protected target: string;
    protected context: {
        [key: string]: any;
    };
    constructor(type?: TaskType, target?: string, context?: {
        [key: string]: any;
    });
    getType(): TaskType;
    setType(type: TaskType): Task;
    getTarget(): string;
    setTarget(target: string): Task;
    getContext(): {
        [key: string]: any;
    };
    setContext(context: {
        [key: string]: any;
    }): Task;
}
