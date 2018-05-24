import IRun from "./IRun";
export default class Run implements IRun {
    protected id: string;
    protected timestamp: number;
    protected success: boolean;
    constructor(id?: string, timestamp?: number, success?: boolean);
    getId(): string;
    setId(id: string): Run;
    getTimestamp(): number;
    setTimestamp(timestamp: number): Run;
    getSuccess(): boolean;
    setSuccess(success: boolean): Run;
}
