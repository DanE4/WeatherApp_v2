import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  response: any;
  addName: any;
  delName: any;
  title: "Angular-WeatherAppFrontend" | undefined;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void{
  }

  onListing(){
    //refreshed datas from backend on every listCity call
    let url = 'http://localhost:8888/list-cities';
    this.http.get(url).subscribe((response) => {
      this.response = response;
      console.log(this.response);
    });
  }

  addCity() {
    let addurl = 'http://localhost:8888/add/';
    console.log(this.addName);
    this.http.post(addurl + this.addName, null).subscribe((response) => {
      this.response = response;
      console.log(this.response);
    });
  }
  deleteCity() {
    let addurl = 'http://localhost:8888/delete/';
    console.log(this.delName);
    this.http.delete(addurl + this.delName).subscribe((response) => {
      this.response = response;
      console.log(this.response);
    });
  }
}

