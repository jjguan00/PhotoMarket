import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  signUp(user){
  	return this._http.post(`/signUp`, user)
  }

  logIn(user){
    console.log(user)
  	return this._http.post('/logIn',user)
  }

  checkLogin(){
  	return this._http.get('/checkLogin')
  }

  logOut(){
    return this._http.get('/logOut')
  }
}
