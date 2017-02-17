import { TransactionType } from '../../shared/models/transaction-type';
import { Sprint } from '../../shared/models/sprint';
import { Team } from '../../shared/models/team';
import { User } from '../../shared/models/user';

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