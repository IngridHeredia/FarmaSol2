import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProductoModel } from '../models/producto-model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly apiUrl = 'https://lmmn42egeh.execute-api.us-east-1.amazonaws.com/v1/';

  constructor(private readonly http: HttpClient) {}

  getProductos(): Observable<ProductoModel[]> {
    return this.http
      .get<{ data: ProductoModel[] }>(`${this.apiUrl}/Productos`)
      .pipe(
        map(response => response.data)
      );
  }
}