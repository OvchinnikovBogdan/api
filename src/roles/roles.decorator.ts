//import { SetMetadata } from '@nestjs/common';
//import { Reflector } from '@nestjs/core';

//export const Roles = (...args: string[]) => SetMetadata('roles', args);
//export const Roles = Reflector.createDecorator<string[]>();
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export enum Role {
  User = 'user',
  Admin = 'admin',
}
