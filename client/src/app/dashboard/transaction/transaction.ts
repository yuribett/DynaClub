import { Sprint } from '../../sprint/sprint';
import { Team } from '../../teams/team';
import { User } from '../../user/user';
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