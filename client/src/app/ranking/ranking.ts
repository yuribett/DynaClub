import { User } from '../shared/models/user';
import { Team } from '../shared/models/team';
import { Sprint } from '../shared/models/sprint';
export class Ranking {
    user: User;
    team: Team;
    sprint: Sprint;
    score: number;
}