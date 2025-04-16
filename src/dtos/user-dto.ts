export interface UserBasicDto {
    id: number;
    guid: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: File;
    isActive: boolean;
    isDeleted?: boolean;
  }