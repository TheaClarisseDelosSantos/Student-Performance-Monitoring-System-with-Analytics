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
      const allowedRoles = route.data['roles'] || [];
      const userRole = user.role;
  
      console.log('User:', user);
      console.log('Allowed Roles:', allowedRoles);
      console.log('User Role:', userRole);
  
      if (allowedRoles.includes(userRole)) {
        console.log('Access granted');
        return true;
      } else {
        console.log('Access denied - Redirecting to login');
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      console.log('User not logged in - Redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }

}
