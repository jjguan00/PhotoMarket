import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedFile: File = null;
  images: Array<any>
  constructor(
  	private _route: ActivatedRoute,
  	private _router: Router,
  	private _postService: PostService
  	) { }

  ngOnInit() {
  	this.getImage()
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

  postImage() {
  	const uploadData = new FormData();
  	uploadData.append('image', this.selectedFile, this.selectedFile.name);
    console.log(uploadData.get("image"))
   	this._postService.postImage(uploadData).subscribe()
  }

  getImage(){
  	this._postService.getImage().subscribe((data)=>{
  		console.log(data)
  		this.images = data['images']
  	})
  }
}
