import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'; // 👈 importa a lib

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule] 
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  loginError: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // 👈 valida se é email válido
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.loginForm.controls['email'].invalid) {
      if (this.loginForm.controls['email'].errors?.['required']) {
        Swal.fire({
          icon: 'warning',
          title: 'E-mail obrigatório',
          text: 'Por favor, digite seu e-mail antes de continuar.'
        });
        return;
      }
      if (this.loginForm.controls['email'].errors?.['email']) {
        Swal.fire({
          icon: 'error',
          title: 'E-mail inválido',
          text: 'O endereço de e-mail digitado não é válido. Ex: usuario@dominio.com'
        });
        return;
      }
    }

    if (this.loginForm.controls['password'].invalid) {
      if (this.loginForm.controls['password'].errors?.['required']) {
        Swal.fire({
          icon: 'warning',
          title: 'Senha obrigatória',
          text: 'Por favor, digite sua senha.'
        });
        return;
      }
      if (this.loginForm.controls['password'].errors?.['minlength']) {
        Swal.fire({
          icon: 'error',
          title: 'Senha muito curta',
          text: 'A senha deve ter pelo menos 4 caracteres.'
        });
        return;
      }
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Login realizado com sucesso!',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = err.error?.message || 'Credenciais inválidas';

        Swal.fire({
          icon: 'error',
          title: 'Falha no login',
          text: this.loginError || ''
        });
      }
    });
  }
}