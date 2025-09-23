import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../../services/user.service';
import { CreateUserRequest } from '../../../shared/models/user.model';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['createUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserFormComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    mockUserService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => { expect(component).toBeTruthy(); });

  it('should initialize form with empty values', () => {
    expect(component.userForm.get('name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const nameControl = component.userForm.get('name');
    const emailControl = component.userForm.get('email');
    expect(nameControl?.valid).toBeFalse();
    expect(emailControl?.valid).toBeFalse();
    nameControl?.setValue('John Doe');
    emailControl?.setValue('john@example.com');
    expect(nameControl?.valid).toBeTrue();
    expect(emailControl?.valid).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.userForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should call userService.createUser on valid form submission', () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    mockUserService.createUser.and.returnValue(of(mockUser));
    component.userForm.patchValue({ name: 'John Doe', email: 'john@example.com' });
    component.onSubmit();
    const expectedRequest: CreateUserRequest = { name: 'John Doe', email: 'john@example.com' };
    expect(mockUserService.createUser).toHaveBeenCalledWith(expectedRequest);
  });

  it('should show success message and reset form on successful submission', () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    mockUserService.createUser.and.returnValue(of(mockUser));
    component.userForm.patchValue({ name: 'John Doe', email: 'john@example.com' });
    component.onSubmit();
    expect(component.successMessage).toBe('Usuário cadastrado com sucesso!');
    expect(component.userForm.get('name')?.value).toBe(null);
    expect(component.userForm.get('email')?.value).toBe(null);
  });

  it('should show error message on submission failure', () => {
    const errorResponse = { status: 400, error: { message: 'Email already exists' } } as any;
    mockUserService.createUser.and.returnValue(throwError(() => errorResponse));
    component.userForm.patchValue({ name: 'John Doe', email: 'john@example.com' });
    component.onSubmit();
    expect(component.errorMessage).toBe('Este e-mail já está cadastrado.');
  });

  it('should not submit invalid form', () => {
    component.userForm.patchValue({ name: '', email: 'invalid-email' });
    component.onSubmit();
    expect(mockUserService.createUser).not.toHaveBeenCalled();
  });
});
