import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

export interface  City {
  results:{
    cityName: string;
    temperature: string;
    time: string;
  }
}
@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  constructor (private http:HttpClient) {}
}
