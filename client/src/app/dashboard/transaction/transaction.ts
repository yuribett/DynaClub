import { Sprint } from '../../shared/models/sprint';
import { Team } from '../../shared/models/team';
import { User } from '../../shared/models/user';
import { TransactionType } from './transaction-type/transaction-type';

export class Transaction {

    from: User;
    to: User;
    date: Date;
    amount: Number;
    message: String;
    team: Team;
    transactionType: TransactionType;
    sprint: Sprint;

}