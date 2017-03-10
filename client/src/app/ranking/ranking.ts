import { User } from '../shared/models/user';
import { Team } from '../shared/models/team';
import { Sprint } from '../shared/models/sprint';
export class Ranking {

    _id: string;
    
    totalAmount: number;

    count: number;

    user: User;
    position: number;
    
}