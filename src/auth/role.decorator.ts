import { SetMetadata } from '@nestjs/common';
import { VaitroNguoiDung } from 'src/user/entities/user.entity';

export type AllowedRole = keyof typeof VaitroNguoiDung | 'Any';
export function Roles(roles: AllowedRole[]) {
  return SetMetadata('roles', roles);
}
