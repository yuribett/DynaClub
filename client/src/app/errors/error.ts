export interface Error {
    ref: String;
    msg: String;
}

export class CommonErrors {

    static errors: Array<Error>;

    static getError(ref): String {
        console.log(ref);
        let error: Error = this.errors.find(error => error.ref == ref);
        return this.decodeMsg(error.msg.toString());
    }

    static decodeMsg(string: string): String {
        let decoder: HTMLElement = document.createElement("div");
        decoder.innerHTML = string;
        return decoder.innerHTML;
    }
}