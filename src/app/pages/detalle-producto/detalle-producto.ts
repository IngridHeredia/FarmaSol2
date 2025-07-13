import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, RouterModule } from '@angular/router';
import { ProductoService } from '../../core/services/producto';
import { CarritoService } from '../../core/services/carrito';
import { ProductoModel } from '../../core/models/producto-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './detalle-producto.html',
  styleUrls: ['./detalle-producto.css']
})
export class DetalleProductoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);

  producto: ProductoModel | null = null;
  productosRelacionados: ProductoModel[] = [];
  cantidad: number = 1;
  mensajeAgregado: boolean = false;

  ngOnInit(): void {
    // Escuchar cambios del parámetro de ruta
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = Number(params.get('id'));
      if (!isNaN(id)) {
        this.cargarProducto(id);
      }
    });
  }

  cargarProducto(id: number): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        if (Array.isArray(productos)) {
          this.producto = productos.find(p => p.id_producto === id) ?? null;
          this.productosRelacionados = productos
            .filter(p => p.id_producto !== id && p.tipo === this.producto?.tipo)
            .slice(0, 4);
          this.cantidad = 1;
          this.mensajeAgregado = false;
        }
      },
      error: (e) => {
        console.error('Error al obtener productos', e);
        this.producto = null;
      }
    });
  }

  cambiarCantidad(valor: number): void {
    const nuevaCantidad = this.cantidad + valor;
    if (nuevaCantidad >= 1) {
      this.cantidad = nuevaCantidad;
    }
  }

  agregarAlCarrito(): void {
    if (this.producto) {
      this.carritoService.agregar(this.producto, this.cantidad);
      this.mensajeAgregado = true;
      setTimeout(() => this.mensajeAgregado = false, 2000);
    }
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  volver(): void {
    this.router.navigate(['/productos']);
  }

  irADetalle(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}
