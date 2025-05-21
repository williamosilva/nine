import {
  Injectable,
  NestMiddleware,
  // Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class JwtUserExtractor implements NestMiddleware {
  // private readonly logger = new Logger(JwtUserExtractor.name);

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // this.logger.debug('JwtUserExtractor middleware started.');

    // this.logger.debug(`Headers: ${JSON.stringify(req.headers)}`);

    try {
      const token = this.extractTokenFromHeader(req);

      // this.logger.debug(`Final token extracted: ${token ?? 'No token found'}`);

      if (token) {
        try {
          const payload = this.jwtService.verify<JwtPayload>(token);
          // this.logger.debug(`Payload checked: ${JSON.stringify(payload)}`);

          if (payload && payload.userId) {
            const user = await this.authService.validateUserById(
              payload.userId,
            );
            if (user) {
              // this.logger.debug(`User found and validated: ID ${user.id}`);
              req['user'] = user;
            } else {
              // this.logger.warn(`User not found for ID: ${payload.userId}`);
            }
          }
        } catch (jwtError) {
          if (jwtError instanceof Error) {
            // this.logger.warn(`Error verifying JWT token: ${jwtError.message}`);
          } else {
            // this.logger.warn(
            //   `Error verifying JWT token: ${JSON.stringify(jwtError)}`,
            // );
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        // this.logger.error(
        //   `Error verifying JWT token: ${error.message}`,
        //   error.stack,
        // );
      } else {
        // this.logger.error(
        //   `Unknown error verifying JWT token: ${JSON.stringify(error)}`,
        // );
      }
    }

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    // this.logger.debug(`Authorization header: ${authHeader || 'not found'}`);

    if (!authHeader) return undefined;

    const parts = authHeader.split(' ');
    // this.logger.debug(`Authorization parts: ${JSON.stringify(parts)}`);

    if (parts.length !== 2) {
      // this.logger.warn('Invalid Authorization header format');
      return undefined;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      // this.logger.warn(`Invalid Scheme: ${scheme}`);
      return undefined;
    }

    return token;
  }
}
