import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
  	private _http: HttpClient
  	) { }

  createPost(post){
  	return this._http.post('/createPost', post)
  }

  getPosts(){
  	return this._http.get('/getPosts')
  }

  updatePost(id, post){
    return this._http.post(`/updatePost/${id}`, post)
  }

  deletePost(id){
    console.log(id)
    return this._http.delete(`/deletePost/${id}`)
  }

  postImage(image){
    return this._http.post('/postImage', image)
  }

  getImage(){
    return this._http.get('getImage')
  }
}
