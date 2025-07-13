import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // Asegura que ReactiveForms funcione
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class Contacto {
  contactoForm: FormGroup;
  mensajeEnviado: boolean = false; // Para mostrar el alert visual de éxito

  constructor(private fb: FormBuilder) {
    this.contactoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required], 
      celular: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],  // 9 dígitos y empieza en 9
      correo: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactoForm.valid) {
      console.log('Datos del formulario:', this.contactoForm.value);

      // Mostramos el mensaje de éxito
      this.mensajeEnviado = true;

      // Ocultar luego de 4 segundos
      setTimeout(() => {
        this.mensajeEnviado = false;
      }, 4000);

      // Aquí puedes agregar un POST al backend más adelante
    } else {
      this.contactoForm.markAllAsTouched();
    }

    console.log('Datos del formulario:', {
      ...this.contactoForm.value,
      celular: '+51' + this.contactoForm.value.celular
    });
  }

  esInvalido(campo: string): boolean {
    const control = this.contactoForm.get(campo);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}
