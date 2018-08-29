import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  logInUser = {}
  constructor(
  	private _userService: UserService,
  	private _router: Router
  	) { }

  ngOnInit() {
  }

  logIn(){
  	return this._userService.logIn(this.logInUser).subscribe(result=>{
  		console.log(result)
  		this._router.navigate(["/frontPage"])
  	})
  }
}
