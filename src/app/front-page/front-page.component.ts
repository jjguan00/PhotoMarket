import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {

  user={}
  constructor(
  	private _userService:UserService,
  	private _router: Router
  	) { }

  ngOnInit() {
  	// this.checkLogin()
  }

  checkLogin(){
  	this._userService.checkLogin().subscribe(data=>{
  		if(data['user']){
  			this.user = data['user']
  		}
  		else{
  			this._router.navigate(["/"])
  		}
  	})
  }

  logOut(){
    this._userService.logOut().subscribe(()=>{
      this.user = {};
      this._router.navigate(["/"])
    })
  }

}
