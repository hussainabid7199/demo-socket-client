export default interface ChatDto {
  id: number;
  roomId: string;
  type: string;
  name?: string;
  description?: string;
  avatarUrl?: string;
  createdBy?: string;
}


export interface ChatUserListDto {
  id: number;
  guid: string;
  firstName: string;
  lastName: string;
}

