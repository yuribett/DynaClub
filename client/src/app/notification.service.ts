import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationService {

    notify(notification: Notification): Observable<String> {

        return new Observable((observer: any) => {
            notification.body = this.decodeMsg(notification.body);
            if (notification.wrapBody && notification.body.length > 38) {
                notification.body = notification.body.substr(0, 38) + '...';
            }
            notification.title = this.decodeMsg(notification.title);
            notification.icon = notification.icon;
            let Notification: any = window["Notification"];
            Notification.requestPermission().then(
                result => {
                    let notify = new Notification(notification.title, notification)
                    notify.onclick = notification.onclick
                    observer.next(notify);
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
    onclick: Function
    wrapBody?: boolean
}