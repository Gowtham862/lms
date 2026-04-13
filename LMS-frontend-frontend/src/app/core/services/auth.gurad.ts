import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from './auth.service';
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  console.log("CURRENT TOKEN =", auth.getToken());
 
  if (auth.isAuthenticated()) {
    return true;
  } 
  const url=state.url;
  router.navigate(['/'])
  return false;
};