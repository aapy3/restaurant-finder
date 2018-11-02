import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ApiHitService {
    public apiUrl = "https://developers.zomato.com/api/v2.1";
    public headers;
  options: any;
  restaurantsList: any;
  details: any;
  constructor(private http: Http) { }


  // fetchData(){
  //   return this.http.get('https://jsonplaceholder.typicode.com/posts');
  // }
  setHeaders(){
    this.headers = new Headers({ 'Content-Type': 'application/json'});
    this.headers.set('user-key' ,'724f46184c0b1806326aacd98a9a109a');
    this.options = new RequestOptions({ headers: this.headers });
    return this.options;
  }

  getRestaurants(data){
    let api = this.apiUrl + '/search?&lat='+data.latitude+'&lon='+data.longitude;
    return this.http.get(api, this.setHeaders());
  }

  sendRestaurants(data){
    this.restaurantsList = data;
  }
  listRestaurants(){
    if(this.restaurantsList){
      return this.restaurantsList;
    }
  }

  getDetails(data){
    let api = this.apiUrl + '/restaurant?res_id='+ data.restaurant.id
    return this.http.get(api, this.setHeaders());
  }

  restaurantDetails(data){
    this.details = data;
  }
  sendDetails(){
    if(this.details){
      return this.details;
    }
  }

  getCities(data){
    let queryData;
    let api;
    if(data.lat && data.lng){
      queryData = 'lat=' + data.lat + '&lon=' + data.lng
      api = this.apiUrl + '/cities?' + queryData
    }
    return this.http.get(api, this.setHeaders());
  }

  getReviews(data,limit,skip){
    let api = this.apiUrl + '/reviews?res_id=' + data + '&start='+ skip + '&count='+limit;
    return this.http.get(api, this.setHeaders());
  }

  getMenu(data){
    let api = this.apiUrl + '/dailymenu?res_id=' + data;
    return this.http.get(api, this.setHeaders());
  }

}
