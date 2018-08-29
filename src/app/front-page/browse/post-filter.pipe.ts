import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postFilter'
})
export class PostFilterPipe implements PipeTransform {

  transform(posts: any[], searchTerm: string) : any[] {

    if(!posts || !searchTerm){
    	return posts;
    }

    return posts.filter(post => post.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }
}
