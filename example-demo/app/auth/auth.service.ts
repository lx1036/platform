import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppAuthState, authLoginSelector, LoginRedirect } from '../app.store';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppAuthState>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(authLoginSelector),
      map(isLogin => {
        if (!isLogin) {
          this.store.dispatch(new LoginRedirect());

          return false;
        }

        return true;
      }),
      take(1)
    );
  }
}
