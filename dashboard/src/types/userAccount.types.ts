export interface IUpdateProfilePayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_number: string;
  gender: string;
}

export interface IChangePasswordPayload {
  old_password: string;
  new_password: string;
}
