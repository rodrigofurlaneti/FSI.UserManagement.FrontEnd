import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CreateUserRequest } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  userForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService, public router: Router) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get name() { return this.userForm.get('name'); }
  get email() { return this.userForm.get('email'); }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userData: CreateUserRequest = { name: this.userForm.value.name, email: this.userForm.value.email };

      this.userService.createUser(userData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Usuário cadastrado com sucesso!';
          this.userForm.reset();
          setTimeout(() => { this.router.navigate(['/users']); }, 1500);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.status === 400 && error.error?.message?.includes('email')) {
            this.errorMessage = 'Este e-mail já está cadastrado.';
          } else {
            this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
          }
        }
      });
    } else {
      Object.keys(this.userForm.controls).forEach(key => this.userForm.get(key)?.markAsTouched());
    }
  }
}
