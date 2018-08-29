import { Component, OnInit } from '@angular/core';
import { PostService } from '../../post.service';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  user= {}
  searchTerm: string;
  posts : object[]
  constructor(
    private _postService:PostService,
    private _userService:UserService,
    private _router: Router
    ) { }

  ngOnInit() {
    this.checkLogin()
  	this.getPosts()
  }

  getPosts(){
  	this._postService.getPosts().subscribe(data => {
  		this.posts = data['posts']
      console.log(this.posts)
  	})
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

}
