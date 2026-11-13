import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Input() userName = '';
  @Input() profileImage = 'assets/images/default-profile.png';

  authService = inject(Auth);

  @Output() login = new EventEmitter<void>();
  @Output() signup = new EventEmitter<void>();
  @Output() myRegistrations = new EventEmitter<void>();

  async onLogout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  onLogin(): void {
    this.login.emit();
  }

  onSignup(): void {
    this.signup.emit();
  }

  onMyRegistrations(): void {
    this.myRegistrations.emit();
  }
}
