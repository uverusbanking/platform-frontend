import { IUser } from "./user.types";

export interface IPublicKey {
  id: string;
  public_key: string;
  app_mode: string;
  is_active: boolean;
}

export interface ILoginPayload {
  email: string;
  type: string;
  encrypted_password: string;
}

export interface ILoginResponse {
  sessionId: string;
}

export interface IVerifyLoginPayload {
  code: string;
  sessionId: string;
}

export interface IVerifyLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  session_id: string;
  user: IUser;
}
