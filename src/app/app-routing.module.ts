import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LogInComponent } from './home/log-in/log-in.component';
import { SignUpComponent } from './home/sign-up/sign-up.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { BrowseComponent } from './front-page/browse/browse.component';
import { ListingComponent } from './front-page/listing/listing.component';

const routes: Routes = [
	{path:"", component: HomeComponent, children:[
		{path:"login", component: LogInComponent},
		{path:"signup", component: SignUpComponent}
	]},
	{path:"frontPage", component: FrontPageComponent,children:[
		{path:"browse", component: BrowseComponent},
		{path:"listing", component: ListingComponent}
	]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
