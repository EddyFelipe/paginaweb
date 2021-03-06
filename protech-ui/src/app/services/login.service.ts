import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';

import { Login } from "../interfaces/login";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  URL:string = "https://api-protech.herokuapp.com/api/login/";

  constructor(private http:HttpClient) { }

  inicioSesion(login:Login){
    let body = JSON.stringify(login);
    console.log(body);
    let headers = new HttpHeaders({
      'Content-Type':'application/json'
    });

    return this.http.post(this.URL,body,{headers:headers,observe:'response'});
  }

  setToken(token){
    sessionStorage.setItem("accesToken",token);
  }

  setUser(user){
    let userString = JSON.stringify(user);
    sessionStorage.setItem("user",userString);
  }

  setAdmin(admin) {
    sessionStorage.setItem("admin",admin);
  }

  getAdmin() {
    return sessionStorage.getItem("admin");
  }

  getToken(){
    return sessionStorage.getItem("accesToken");
  }

  getUser(){
    return sessionStorage.getItem("user");
  }

  logOut(){
    sessionStorage.clear();
  }

  isLogged():boolean {

    if(null!=sessionStorage.getItem("accesToken")){
      return true;
    }else{
      return false;
    }
  }

}
