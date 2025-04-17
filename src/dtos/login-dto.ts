import UserDto from "./user-dto";

export default interface LoginBasicDto {
  id: number;
  guid: string;
  email: string;
  password: string;
  isActive: boolean;
  isDeleted?: boolean;
}


export interface LoginDto {
  token: string | null;
  tokenExpiryDate: Date;
  refreshToken: string | null;
  user: UserDto;
}




