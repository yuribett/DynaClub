import { Team } from '../../teams/team';
import { User } from '../../user/user';

export class Transaction {

    from: User;
    to: User;
    date: Date;
    amount: Number;
    message: String;
    team: Team;
    
}