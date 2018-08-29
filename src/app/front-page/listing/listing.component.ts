import { Component, OnInit } from '@angular/core';
import { PostService } from '../../post.service';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  createPost: any={};
  updatePost: any={};
  user: any={};
  url: any;
  selectedFile: File = null;
  images: Array<any>

  constructor(
  	private _postService: PostService,
  	private _router: Router,
    private _userService: UserService
  	) {
    this.getUser()
  }

  ngOnInit() {
  }

  createPostx(){
    const uploadData = new FormData();
    uploadData.append('title', this.createPost.title);
    uploadData.append('desc', this.createPost.desc);
    uploadData.append('price', this.createPost.price);
    uploadData.append('image', this.selectedFile, this.selectedFile.name);
  	this._postService.createPost(uploadData).subscribe(result=>{
      this.createPost = {}
      console.log(result)
      this.user = result['user']
      this.images = null
  		this._router.navigate(["frontPage/listing"])
  	})
  }
  updatePostx(id){
    this._postService.updatePost(id,this.updatePost).subscribe((result)=>{
      this._router.navigate(["frontPage/browse"])
    });
  }

  deletePost(id){
    this._postService.deletePost(id).subscribe(res=>{
        console.log(res)
        this.user = res['user']
        this._router.navigate(["frontPage/listing"])
      }
    )
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
    console.log(this.selectedFile)
    var reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      this.url = (<FileReader>event.target).result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  // postImage() {
  //   const uploadData = new FormData();
  //   uploadData.append('image', this.selectedFile, this.selectedFile.name);
  //   console.log(uploadData.get("image"))
  //    this._postService.postImage(uploadData).subscribe()
  // }
  getUser(){
    this._userService.checkLogin().subscribe(user =>{
      this.user = user['user']
    })
  }


  getImage(){
    this._postService.getImage().subscribe((data)=>{
      console.log(data)
      this.images = data['images']
    })
  }
}
