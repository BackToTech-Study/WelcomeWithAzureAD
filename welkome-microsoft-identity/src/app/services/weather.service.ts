import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { protectedResources } from './auth-config.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  readonly url: string = protectedResources.weather;
  
  constructor(
    private http: HttpClient
  ) { }

  public getForecast(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}
