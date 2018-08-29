import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service'; 
import { Router } from '@angular/router'
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  userSignUp = {}
  error=""
  constructor(
  	private _userService: UserService,
    private _router: Router
  	) { }

  ngOnInit() {
  }

  signUp(){
  	this._userService.signUp(this.userSignUp).subscribe(result=>{
      if(result['success']){
        this._router.navigate(["/frontPage"])
      }
      else{
        console.log(result)
      }
  	})
  }
}
