import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationService {

    notify(notification: Notification): Observable<String> {

        return new Observable((observer: any) => {
            notification.body = this.decodeMsg(notification.body);
            notification.title = this.decodeMsg(notification.title);
            let Notification: any = window["Notification"];
            Notification.requestPermission().then(
                result => {
                    observer.next(new Notification(notification.title, notification));
                    observer.complete();
                },
                error => {
                    observer.error(new Error(`Notifications blocked by user!`));
                    observer.complete();
                }
            );
        });
    }


    decodeMsg(string: string) {
        let decoder: HTMLElement = document.createElement("div");
        decoder.innerHTML = string;
        return decoder.innerHTML;
    }
}

interface Notification {
    body?: string
    icon?: string
    tag?: string
    renotify?: boolean
    silent?: boolean
    sound?: string
    noscreen?: boolean
    sticky?: boolean
    dir?: 'auto' | 'ltr' | 'rtl'
    lang?: string
    vibrate?: number[]
    requireInteraction?: boolean
    title: string
}