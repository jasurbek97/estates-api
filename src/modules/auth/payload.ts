import { UserInterface } from '../users/interfaces/user.interface';

export const getPayload = (user: UserInterface) => {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    surname: user.surname,
    birthday: user.birthday,
    email: user.email,
    gander: user.gander,
    role: user.role,
    is_verified: user.is_verified,
    state: user.state,
  };
};
