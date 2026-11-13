import { Injectable, signal } from '@angular/core';

import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  fetchAuthSession,
  getCurrentUser,
  fetchUserAttributes,
} from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  isAuthenticated = signal(false);

  currentUser = signal<any>(null);

  // Student signup
  async register(data: { name: string; email: string; mobile: string; password: string }) {
    return await signUp({
      username: data.email,
      password: data.password,
      options: {
        userAttributes: {
          email: data.email,
          name: data.name,
          phone_number: data.mobile,
        },
      },
    });
  }

  // Verify email OTP
  async verifyEmail(email: string, code: string) {
    return await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
  }

  // Student login
  async login(email: string, password: string) {
    const result = await signIn({
      username: email,
      password,
    });

    if (result.isSignedIn) {
      await this.checkAuthStatus();
    }

    return result;
  }

  // Check existing Cognito session
  async checkAuthStatus(): Promise<void> {
    try {
      const session = await fetchAuthSession();
      const attributes = await fetchUserAttributes();

      if (session.tokens?.accessToken) {
        const user = await getCurrentUser();

        this.isAuthenticated.set(true);
        this.currentUser.set({
          ...user,
          name: attributes.name || user.username,
          email: attributes.email || '',
        });

        console.log(this.currentUser());
      } else {
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
      }
    } catch {
      this.isAuthenticated.set(false);
      this.currentUser.set(null);
    }
  }

  // Student logout
  async logout(): Promise<void> {
    await signOut();

    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}
