import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  private apiKey: string = '46Vif89ceflaEKOd9oPfBxAOAb6gszcX';
  private baseURL: string = 'https://api.giphy.com/v1/gifs';

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    // this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    if (localStorage.getItem('historial')) {
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }

    if (localStorage.getItem('gifs')) {
      this.resultados = JSON.parse(localStorage.getItem('gifs')!);
    }
  }

  buscarGifs(query: string = '') {
    if (query.length === 0) return;
    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.baseURL}/search`, { params })
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem('gifs', JSON.stringify(this.resultados));
      });

  }
}
