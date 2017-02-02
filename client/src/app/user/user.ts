import { Team } from '../teams/team';

export class User {
	_id: string;
	name: string;
	user: string;
	email: string;
	password: string;
	admin: boolean;
	teams: Team[];
	active: boolean;
}
