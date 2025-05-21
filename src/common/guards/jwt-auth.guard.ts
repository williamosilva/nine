import { Injectable, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

interface JwtPayload {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      const request = context
        .switchToHttp()
        .getRequest<Request & { user?: JwtPayload }>();

      return this.handlePublicRoute(context).pipe(
        switchMap((authenticated) => {
          request.user = authenticated ? request.user : undefined;

          return of(true);
        }),
        catchError(() => of(true)),
      );
    }

    return super.canActivate(context);
  }

  private handlePublicRoute(context: ExecutionContext): Observable<boolean> {
    try {
      const result = super.canActivate(context);

      if (result instanceof Observable) {
        return result;
      }
      if (result instanceof Promise) {
        return from(result);
      }
      return of(result);
    } catch {
      return of(false);
    }
  }
}
