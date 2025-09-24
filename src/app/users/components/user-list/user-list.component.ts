import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../../shared/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao carregar usuários. Tente novamente.';
        console.error('Error loading users:', error);
      }
    });
  }

  /** 
   * Agora o botão "Cadastrar Novo Usuário" chama este método,
   * que abre um modal SweetAlert2 ao invés de redirecionar.
   */
  async openAddUserModal(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Cadastrar Novo Usuário',
      html:
        `<input id="swal-input-name" class="swal2-input" placeholder="Nome">` +
        `<input id="swal-input-email" class="swal2-input" placeholder="Email">` +
        `<input id="swal-input-pass" type="password" class="swal2-input" placeholder="Senha">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Cadastrar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
        const email = (document.getElementById('swal-input-email') as HTMLInputElement).value;
        const password = (document.getElementById('swal-input-pass') as HTMLInputElement).value;

        // 🔎 Validações
        if (!name) {
          Swal.showValidationMessage('O nome é obrigatório!');
          return false;
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
          Swal.showValidationMessage('Digite um e-mail válido!');
          return false;
        }
        if (!password || password.length < 6) {
          Swal.showValidationMessage('A senha deve ter pelo menos 6 caracteres!');
          return false;
        }

        return { name, email, password };
      }
    });

    if (formValues) {
      this.userService.createUser(formValues).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Usuário cadastrado com sucesso!',
            timer: 1500,
            showConfirmButton: false
          });
          this.loadUsers(); // atualiza lista
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar usuário',
            text: err.error?.message || 'Tente novamente.'
          });
        }
      });
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  }
}