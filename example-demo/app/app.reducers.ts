import * as fromRouter from '@ngrx/router-store';
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

import {
  AuthActionsUnion,
  AuthActionTypes,
  LayoutActionsUnion,
  LayoutActionTypes,
} from './app.actions';
import { User } from '../../example-app/app/auth/models/user';
import { __extends } from 'tslib';

export interface AppState {
  layout: LayoutState;
}

export function logger(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return function(state: AppState, action: Action): AppState {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const reducers: ActionReducerMap<AppState> = {
  layout: layoutReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger, storeFreeze]
  : [];

export interface LayoutState {
  showSidenav: boolean;
}

const initialState: LayoutState = {
  showSidenav: false,
};

export function layoutReducer(
  state: LayoutState = initialState,
  action: LayoutActionsUnion
): LayoutState {
  switch (action.type) {
    case LayoutActionTypes.CloseSidenav:
      return {
        showSidenav: false,
      };

    case LayoutActionTypes.OpenSidenav:
      return {
        showSidenav: true,
      };

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

export interface AppAuthState extends AppState {
  auth: AuthState;
}

export interface AuthState {
  loggedIn: boolean;
  user: User | null;
}
export interface AuthStatusState {
  status: AuthState;
  // loginPage: fromLoginPage.State;
}
export const initialAuthState: AuthState = {
  loggedIn: false,
  user: null,
};
export function authReducer(
  state = initialAuthState,
  action: AuthActionsUnion
): AuthState {
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

export const authStatusSelector = createSelector(
  (state: AppAuthState) => state.auth,
  (state: AuthStatusState) => state.status
);
export const authLoginStateSelector = createSelector(
  authStatusSelector,
  (state: AuthState) => state.loggedIn
);
