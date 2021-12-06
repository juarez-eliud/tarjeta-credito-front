import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tarjeta } from '../models/tarjeta';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {

  private route = `${environment.endpoint}Tarjeta`;

  constructor(private http: HttpClient) { }

  getListTarjetas(): Observable<Tarjeta[]> {
    return this.http.get<Array<Tarjeta>>(this.route);
  }

  deleteTarjeta(id: number) {
    return this.http.delete(`${this.route}/${id}`);
  }

  saveTarjeta(tarjeta: Tarjeta): Observable<Tarjeta> {
    return this.http.post<Tarjeta>(this.route, tarjeta);
  }

  updateTarjeta(id: number, tarjeta: Tarjeta) {
    return this.http.put<Tarjeta>(`${this.route}/${id}`, tarjeta);
  }

}
