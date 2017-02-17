import { Observable } from 'rxjs';
export interface Error {
    ref: string;
    msg: string;
}

export class CommonErrors {

    static errors: Array<Error>;

    static getErrorByRef(ref): Observable<Error> {
        return new Observable((observer: any) => {
            try {
                let error: Error = this.errors.find(error => error.ref == ref);
                observer.next(error);
            } catch (error) {
                observer.error(error);
            }
            observer.complete();
        });
    }

    static parseServerErrors(json): Observable<Error> {

        return new Observable((observer: any) => {
            try {
                JSON.parse(json).forEach(error => {
                    observer.next({
                        ref: error.param,
                        msg: this.decodeMsg(error.msg)
                    });
                });

            } catch (error) {
                observer.error(error);
            }
            observer.complete();
        });
    }

    static decodeMsg(string: string): string {
        let decoder: HTMLElement = document.createElement("div");
        decoder.innerHTML = string;
        return decoder.innerHTML;
    }
}