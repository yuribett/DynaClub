import { User } from '../../user/user';

export class Transaction {

    from: User;
    to: User;
    date: Date;
    amount: Number;
    message: String;

}