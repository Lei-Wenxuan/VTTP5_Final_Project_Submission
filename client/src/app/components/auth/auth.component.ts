import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  authForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {
    this.createForm();
  }

  createForm() {
    if (this.isLoginMode) {
      this.authForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', Validators.required],
      });
    } else {
      this.authForm = this.fb.group(
        {
          username: ['', [Validators.required]],
          password: ['', Validators.required],
          confirmPassword: ['', Validators.required],
        },
        { validator: this.passwordMatchValidator },
      );
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.createForm();
  }

  onSubmit() {
    if (this.authForm.hasError('passwordMismatch')) {
      this.snackBar.open('Passwords do not match', 'Close', {
        duration: 3000,
      });
      return;
    }
    if (this.authForm.valid) {
      const { username, password } = this.authForm.value;

      if (this.isLoginMode) {
        console.log('Login with:', username, password);
        this.authService.login(username, password).subscribe({
          next: () => {
            this.snackBar.open('Login successful!', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/list']);
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open(err.error.message, 'Close', { duration: 3000 });
          },
        });
      } else {
        console.log('Register with:', username, password);
        this.authService.register(username, password).subscribe({
          next: () => {
            this.snackBar.open('Registration successful!', 'Close', {
              duration: 3000,
            });
            this.switchMode();
          },
          error: (err) => {
            console.error(err.error);
            this.snackBar.open(err.error.message, 'Close', {
              duration: 3000,
            });
          },
        });
      }
    }
  }
}
