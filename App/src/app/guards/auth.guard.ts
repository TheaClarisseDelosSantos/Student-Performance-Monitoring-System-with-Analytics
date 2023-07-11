import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {}

  

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
  
    await this.storage.create();
  
    const user = await this.storage.get('session_storage');
    if (user) {
      // User is logged in, check if their role is allowed for the route
      const allowedRoles = route.data['roles'];
      const userRole = user.role;
  
      console.log('User:', user);
      console.log('Allowed Roles:', allowedRoles);
      console.log('User Role:', userRole);
  
      if (allowedRoles.includes(userRole)) {
        // User role is allowed, allow access to the requested route
        console.log('Access granted');
        return true;
      } else {
        // User role is not allowed, redirect to unauthorized page or handle as desired
        console.log('Access denied - Redirecting to login');
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      // User is not logged in, redirect to the login page
      console.log('User not logged in - Redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
