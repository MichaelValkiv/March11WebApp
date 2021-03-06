import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AuthenticatedUserService } from './authenticated-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate {

  constructor( private authenticationService: AuthenticationService,
               private authUser: AuthenticatedUserService,
               private router: Router ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.isLoggedIn() && this.authenticationService.detectRole()) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
