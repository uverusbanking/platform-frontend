import { IUser } from "./user.types";

export interface IVerifyLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  session_id: string;
  user: IUser;
}
