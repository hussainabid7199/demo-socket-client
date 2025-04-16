export interface MessageDto {
    id: number;
    chatContactId: number;
    groupId: number;
    groupMemberId: number;
    currentUserId: number;
    message: string;
    createdAt: string;
    createdBy: string;
    updatedAt?: string; 
    updatedBy?: string; 
    isActive: boolean;
    isDeleted?: boolean;
  }