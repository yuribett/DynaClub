import { Injectable } from '@angular/core';
import { Request, XHRBackend, BrowserXhr, ResponseOptions, XSRFStrategy, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from '../user/user.service';

@Injectable()
export class ExtendedXHRBackend extends XHRBackend {

    constructor(browserXhr: BrowserXhr, baseResponseOptions: ResponseOptions, xsrfStrategy: XSRFStrategy, private user: UserService) {
        super(browserXhr, baseResponseOptions, xsrfStrategy);
    }

    createConnection(request: Request) {
        let token = localStorage.getItem('dynaclub-token');
        request.headers.set('x-access-token', `${token}`);
        request.headers.set('Content-Type', 'application/json');
        let xhrConnection = super.createConnection(request);
        xhrConnection.response = xhrConnection.response.catch((error: Response) => {
            if (error.status === 401 || error.status === 403) {
                console.log('acesso nao autorizado');
                localStorage.removeItem('dynaclub-token');
                this.user.removeStoredUser();
            }
            return Observable.throw(error);
        });
        return xhrConnection;
    }
}