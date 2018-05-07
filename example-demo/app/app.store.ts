import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../environments/environment';

import * as fromRouter from '@ngrx/router-store';
import { Params } from '@angular/router';

//***************************** AppState/Initializer *****************************//

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export interface AppState {
  layout: LayoutState;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export enum LayoutActionTypes {
  OpenSidenav = '[Layout] Open Sidenav',
  CloseSidenav = '[Layout] Close Sidenav',
}

export class OpenSidenav implements Action {
  readonly type = LayoutActionTypes.OpenSidenav;
}

export class CloseSidenav implements Action {
  readonly type = LayoutActionTypes.CloseSidenav;
}

export type LayoutActionsUnion = OpenSidenav | CloseSidenav;

export function logger(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return function(state: AppState | undefined, action: Action): AppState {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const reducers: ActionReducerMap<AppState> = {
  layout: layoutReducer,
  router: fromRouter.routerReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger, storeFreeze]
  : [];

export interface LayoutState {
  showSidenav: boolean;
}

const initialLayoutState: LayoutState = {
  showSidenav: false,
};

export function layoutReducer(
  state: LayoutState | undefined = initialLayoutState,
  action: LayoutActionsUnion
): LayoutState {
  switch (action.type) {
    case LayoutActionTypes.CloseSidenav:
      return { showSidenav: false };

    case LayoutActionTypes.OpenSidenav:
      return { showSidenav: true };

    default:
      return state;
  }
}

export const layoutFeatureSelector = (appState: AppState) => appState.layout;
export const layoutStateSelector = createSelector(
  // createFeatureSelector<LayoutState>('layout'),
  (appState: AppState) => appState.layout,
  (state: LayoutState) => state.showSidenav
);
//***************************** AppState *****************************//

//***************************** AuthState *****************************//
/**
  {
    auth: {
      status: {
        loggedIn: boolean,
        user: {
          name: string
        }
      },
      loginPage: {
        error: string,
        pending: boolean
      }
    }
  }
 */
export interface AppAuthState extends AppState {
  auth: AuthStatusLoginState;
}
export interface AuthStatusLoginState {
  status: LoginUserState;
  loginPage: LoginPageState;
}
export interface LoginPageState {
  error: string | null;
  pending: boolean;
}
export interface LoginUserState {
  loggedIn: boolean;
  user: User | null;
}

export const initialAuthState: LoginUserState = {
  loggedIn: false,
  user: null,
};

export interface Authenticate {
  username: string;
  password: string;
}

export interface User {
  name: string;
}

export enum AuthActionTypes {
  Login = '[Auth] Login',
  Logout = '[Auth] Logout',
  LoginSuccess = '[Auth] Login Success',
  LoginFailure = '[Auth] Login Failure',
  LoginRedirect = '[Auth] Login Redirect',
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;

  constructor(public payload: Authenticate) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccess;

  constructor(public payload: { user: User }) {}
}

export class LoginFailure implements Action {
  readonly type = AuthActionTypes.LoginFailure;

  constructor(public payload: any) {}
}

export class LoginRedirect implements Action {
  readonly type = AuthActionTypes.LoginRedirect;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export type AuthActionsUnion =
  | Login
  | LoginSuccess
  | LoginFailure
  | LoginRedirect
  | Logout;

export function authReducer(
  state = initialAuthState,
  action: AuthActionsUnion
): LoginUserState {
  switch (action.type) {
    case AuthActionTypes.LoginSuccess: {
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
      };
    }

    case AuthActionTypes.Logout: {
      return initialAuthState;
    }

    default: {
      return state;
    }
  }
}

export const authFeatureSelector = createFeatureSelector<AuthStatusLoginState>(
  'auth'
);

export const authStatusSelector = createSelector(
  authFeatureSelector,
  (state: AuthStatusLoginState) => state.status
);
export const authLoginStateSelector = createSelector(
  authStatusSelector,
  (state: LoginUserState) => state.loggedIn
);

//***************************** AuthState *****************************//
