import { environment } from '../environments/environment';

export class Globals {
  public static API_URL = environment.server + 'api';
  public static SOCKET_IO_URL = environment.server;
  public static LOCAL_TOKEN = 'dynaclub-token';
  public static LOCAL_USER = 'dynaclub-user';
  public static CURRENT_TEAM = 'dynaclub-team';
  public static USER_LOCAL_STORAGE = 'dynaclub-use-local-storage';
}
