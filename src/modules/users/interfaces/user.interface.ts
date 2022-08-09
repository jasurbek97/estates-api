export interface UserInterface {
  id?: string;
  name: string;
  surname: string;
  password: string;
  phone: string;
  is_verified?: boolean;
  verification_attempt?: number;
}
