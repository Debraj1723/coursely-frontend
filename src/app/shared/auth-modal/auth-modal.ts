import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-auth-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.scss',
})
export class AuthModal {
  private fb = inject(FormBuilder);
  authService = inject(Auth);

  @Input() initialMode: 'login' | 'signup' = 'login';
  @Output() close = new EventEmitter<void>();

  mode: 'login' | 'signup' | 'verify' = 'login';

  loading = false;
  errorMessage = signal('');
  successMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  verifyForm = this.fb.group({
    code: ['', Validators.required],
  });

  ngOnInit(): void {
    this.mode = this.initialMode;
  }

  async submit(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.mode === 'login') {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
      }
    }

    if (this.mode === 'signup') {
      if (this.signupForm.invalid) {
        this.signupForm.markAllAsTouched();
        return;
      }

      if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
        this.errorMessage.set('Passwords do not match.');
        return;
      }
    }

    if (this.mode === 'verify' && this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    try {
      if (this.mode === 'signup') {
        const { name, email, mobile, password } = this.signupForm.getRawValue();

        const result = await this.authService.register({
          name: name!,
          email: email!,
          mobile: mobile!,
          password: password!,
        });

        if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          this.mode = 'verify';
          this.successMessage.set('Verification code sent to your email.');
        } else {
          this.successMessage.set('Account created successfully. Please sign in.');
          this.mode = 'login';
        }
      } else if (this.mode === 'verify') {
        const email = this.signupForm.getRawValue().email!;
        const code = this.verifyForm.getRawValue().code!;

        const result = await this.authService.verifyEmail(email, code);

        if (result.isSignUpComplete) {
          this.mode = 'login';
          this.loginForm.patchValue({ email });
          this.successMessage.set('Email verified successfully. Please sign in.');
        }
      } else {
        const { email, password } = this.loginForm.getRawValue();

        const result = await this.authService.login(email!, password!);

        if (result.isSignedIn) {
          this.close.emit();
        } else {
          this.errorMessage.set('Additional sign-in verification is required.');
        }
      }
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Something went wrong. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  switchMode(mode: 'login' | 'signup'): void {
    this.mode = mode;
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  onClose(): void {
    this.close.emit();
  }
}
