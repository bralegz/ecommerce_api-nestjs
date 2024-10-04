import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
import { Role } from '../enums/roles.enum';
import { Repository } from 'typeorm';
import { Users } from '../../Users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  //reflector needed to read the metadata set in the roles decorator
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Get the role passed on the metadata from the controller with the @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();

    //this user property is added to the request object when we verify the JWT in the AuthGuard
    const user = request.user;

    //check the user in the db
    // const dbUser = await this.userRepository.findOne({
    //   where: { id: user.id },
    // });

    //check if the role of the dbuser match with the roles in the token
    // const roleDbUser = dbUser.isAdmin ? Role.Admin : Role.User;
    // if (user.roles[0] !== roleDbUser) {
    //   user.roles[0] = roleDbUser;
    // }

    //check if at least one role in the metadata (required roles array) is present in the user.roles array
    const hasRole = () =>
      requiredRoles.some((role) => user?.roles?.includes(role));

    // checks if the user exists, if the user has roles and if it has the required role to pass the authorization
    const valid = user && user.roles && hasRole();
    if (!valid) {
      throw new ForbiddenException(
        'You dont have authorization to access this route',
      );
    }

    return valid;
  }
}
