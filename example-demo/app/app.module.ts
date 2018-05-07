import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page.component';
import { Store, StoreModule } from '@ngrx/store';
import {
  reducers,
  metaReducers,
  State,
  layoutStateSelector,
  authLoginStateSelector,
} from './app.reducers';
import { MaterialModule } from './material.module';
import { LayoutComponent } from './layout/layout.component';
import { SidenavComponent } from './layout/sidenav.component';
import { ToolbarComponent } from './layout/toolbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavItemComponent } from './layout/nav-item.component';
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import * as AppActions from './app.actions';

@Component({
  selector: 'bc-app',
  template: `
    <bc-layout>
      <bc-sidenav [open]="showSidenav$ | async">
        <bc-nav-item (navigate)="closeSidenav()" *ngIf="loggedIn$ | async" routerLink="/" icon="book" hint="View your book collection">
          My Collection
        </bc-nav-item>
        <bc-nav-item (navigate)="closeSidenav()" *ngIf="loggedIn$ | async" routerLink="/books/find" icon="search" hint="Find your next book!">
          Browse Books
        </bc-nav-item>
        <bc-nav-item (navigate)="closeSidenav()" *ngIf="!(loggedIn$ | async)">
          Sign In
        </bc-nav-item>
        <bc-nav-item (navigate)="logout()" *ngIf="loggedIn$ | async">
          Sign Out
        </bc-nav-item>
      </bc-sidenav>

      <bc-toolbar (openMenu)="openSidenav()">
        Book Collection
      </bc-toolbar>
      
      <router-outlet></router-outlet>
    </bc-layout>
  `,
})
export class AppComponent {
  showSidenav$: Observable<boolean>;
  loggedIn$: Observable<boolean>;

  constructor(private store: Store<State>) {
    this.showSidenav$ = store.pipe(select(layoutStateSelector));
    this.loggedIn$ = store.pipe(select(authLoginStateSelector));
  }

  openSidenav() {
    this.store.dispatch(new AppActions.OpenSidenav());
  }

  closeSidenav() {
    this.store.dispatch(new AppActions.CloseSidenav());
  }
}

export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,

    RouterModule.forRoot(routes),
    StoreModule.forRoot(reducers, { metaReducers }),
  ],
  declarations: [
    AppComponent,
    NotFoundPageComponent,

    // layout
    LayoutComponent,
    SidenavComponent,
    ToolbarComponent,
    NavItemComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
