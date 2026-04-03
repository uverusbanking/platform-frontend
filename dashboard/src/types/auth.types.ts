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

export interface ILoginSuccessResponse {
  sessionId: string;
}

export interface IVerifyLoginPayload {
  code: string;
  sessionId: string;
}

export interface IVerifyLoginResponse {
  access_token: string;
  session_id: string;
  user: IUser;
}

export interface IRefreshTokenPayload {
  sessionId: string;
  refreshToken: string;
}

// Forgot Password Types
export interface IForgotPasswordPayload {
  email: string;
  type: "PLATFORM" | "ORGANISATION" | "CUSTOMER";
}

export interface IVerifyForgotOTPPayload {
  email: string;
  otp: string;
  type: "PLATFORM" | "ORGANISATION" | "CUSTOMER";
}

export interface IVerifyForgotOTPResponse {
  session_id: string;
}

export interface IResetPasswordPayload {
  session_id: string;
  new_password: string;
}

export interface IResendForgotOTPPayload {
  email: string;
  type: "PLATFORM" | "ORGANISATION" | "CUSTOMER";
}
