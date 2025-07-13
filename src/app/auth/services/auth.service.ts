import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginRequest } from './loginRequest';
import { RegisterRequest } from './registerRequest';
import { User } from './user';
import { guardarSesion, obtenerSesion, cerrarSesion } from './session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private modoBackend = false; 

  private usuarioSubject = new BehaviorSubject<User | null>(obtenerSesion());
  usuario$ = this.usuarioSubject.asObservable();

  constructor() {}

  login(request: LoginRequest): boolean {
    if (!this.modoBackend) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '{}');
      const usuario = usuarios[request.email];

      if (usuario && usuario.password === request.password) {
        guardarSesion(usuario);
        this.usuarioSubject.next(usuario);
        return true;
      }
      return false;
    }

    
    console.warn('Modo backend activo, login con API');
    return false;
  }

  registrar(request: RegisterRequest): User {
    if (!this.modoBackend) {
      const nuevo: User = {
        id: crypto.randomUUID(),
        nombre: request.nombre,
        apellido: request.apellido,
        email: request.email,
        telefono: request.telefono,
        password: request.password,
        tipoDocumento: request.tipoDocumento,
        numeroDocumento: request.numeroDocumento,
        direccion: request.direccion,
        distrito: request.distrito,
        departamento: request.departamento,
        codigoZip: request.codigoZip,
        referencia: request.referencia
      };

      guardarSesion(nuevo);
      this.usuarioSubject.next(nuevo);

      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '{}');
      usuarios[nuevo.email] = nuevo;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      return nuevo;
    }

 
    console.warn('Modo backend activo registrar con API');
    return {} as User;
  }

  getUsuarioActivo(): User | null {
    return this.usuarioSubject.getValue();
  }

  logout() {
    cerrarSesion();
    this.usuarioSubject.next(null);
  }
}
