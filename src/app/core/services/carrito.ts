import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarritoModel } from '../models/carrito-model';
import { ProductoModel } from '../models/producto-model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private readonly apiUrl = 'https://lmmn42egeh.execute-api.us-east-1.amazonaws.com/v1/';
  private listCarrito: CarritoModel[] = [];

   constructor(private http: HttpClient) {} 

  // Ejemplo de métodos para el backend:
  getCarritoBackend() {
    return this.http.get<CarritoModel[]>(`${this.apiUrl}carrito`);
  }

  agregarProductoBackend(producto: ProductoModel, cantidad: number) {
    return this.http.post(`${this.apiUrl}carrito`, { producto, cantidad });
  }

  actualizarProductoBackend(id_producto: number, cantidad: number) {
    return this.http.put(`${this.apiUrl}carrito/${id_producto}`, { cantidad });
  }

  eliminarProductoBackend(id_producto: number) {
    return this.http.delete(`${this.apiUrl}carrito/${id_producto}`);
  }

  vaciarCarritoBackend() {
    return this.http.delete(`${this.apiUrl}carrito`);
  }


  // Devuelve toda la lista del carrito
  getCarrito(){
    this.obtenerSession();
    return this.listCarrito; 
  }

  // Acumula o crea un NUEVO item al carrito de compras
  agregar(producto: ProductoModel, cantidad: number = 1){
    this.obtenerSession(); 
    const index = this.listCarrito.findIndex(item => item.producto.id_producto == producto.id_producto);

    if(index == -1){
      // si no existe, se crear nuevo item
      const item = new CarritoModel(producto , cantidad);
      this.listCarrito.push(item);
    }else{
      // Si el producto ya está en el carrito
      this.actualizar(index, this.listCarrito[index].cantidad + cantidad);
    }
    this.guardarSession(); 
  }

  // Actualiza la cantidad de un producto en el carrito
  actualizar(index: number , cantidad: number){
    if(index>=0 && index < this.listCarrito.length){
      this.listCarrito[index].cantidad = cantidad;
    }
    this.guardarSession();
  }

  // Devuelve la cantidad de ítems distintos en el carrito (se muestra en el header.html)
  cantidad(){
    this.obtenerSession();
    return this.listCarrito.length;
  }

  // Calcula el importe total acumulado del carrito
  total(){
    const total = this.listCarrito.reduce((sum , item) => 
      sum + item.producto.precio * item.cantidad , 0
    );
    return total; // devuelve total
  }

  // Elimina un producto del carrito según su índice
  eliminar(index:number){
    if(index>=0 && index < this.listCarrito.length){
      this.listCarrito.splice(index , 1);
    }
    this.guardarSession();
  }

     
 
  guardarSession(){
    localStorage.setItem('carrito' , JSON.stringify(this.listCarrito));
  }


  obtenerSession(){
    this.listCarrito = [];

    if(typeof window != 'undefined' && window.localStorage){
      const carrito = localStorage.getItem('carrito');
      if(carrito !=null){
        this.listCarrito = JSON.parse(carrito);
      }
    }
  }

  vaciarCarrito() {
    this.listCarrito = [];
    localStorage.removeItem('carrito');
  }
}
