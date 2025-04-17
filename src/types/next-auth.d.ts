import UserDto from "@/dtos/user-dto";
declare module "next-auth" {
  interface Session {
    user: UserDto;
  }
}
