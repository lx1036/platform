import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LoginFormComponent, LoginPageComponent } from './login-page.component';
import { AuthEffects, authReducers } from '../app.store';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: 'login', component: LoginPageComponent }]),
    StoreModule.forFeature('auth', authReducers),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [LoginPageComponent, LoginFormComponent],
})
export class AuthModule {}
