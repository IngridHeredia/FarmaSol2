import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../../core/services/producto';
import { CarritoService } from '../../../core/services/carrito';
import { ProductoModel } from '../../../core/models/producto-model';

@Component({
  selector: 'app-catalogo-principal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './catalogo-principal.html',
  styleUrls: ['./catalogo-principal.css']
})
export class CatalogoPrincipal implements OnInit {
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);

  productos: ProductoModel[] = [];
  mensajeAgregado: { [id_producto: number]: boolean } = {};

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.productos = data;
        }
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
      }
    });
  }

  agregarAlCarrito(producto: ProductoModel): void {
    this.carritoService.agregar(producto, 1);
    this.mensajeAgregado[producto.id_producto] = true;

    // Oculta la alerta después de 2 segundos
    setTimeout(() => {
      this.mensajeAgregado[producto.id_producto] = false;
    }, 2000);
  }
}
