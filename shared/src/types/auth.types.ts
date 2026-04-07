export interface IPublicKey {
  id: string;
  public_key: string;
  app_mode: string;
  is_active: boolean;
}

export interface ILoginPayload {
  email: string;
  encrypted_password: string;
}

export interface ResendLoginResponse {
  session_id: string;
}

export interface ILoginResponse {
  session_id: string;
}

export interface IVerifyLoginPayload {
  code: string;
  session_id: string;
}

export interface VerifyOtpResponse {
  session_id?: string;
  data?: {
    session_id?: string;
  };
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IVerifyForgotOTPPayload {
  email: string;
  otp: string;
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
}
