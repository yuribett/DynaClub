import { UserComponent } from '../../user/user.component';

export class Transaction {

    from: UserComponent;
    to: UserComponent;
    date: Date;
    amount: Number;
    message: String;

}