import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NewsComponent } from './components/news/news.component';
import { AboutComponent } from './components/about/about.component';
import { ProductsComponent } from './components/products/products.component';
import { ArticleComponent } from './components/article/article.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthenticationGuardService } from './services/authentication-guard.service';
import { ProfileComponent } from './components/profile/profile.component';
import { RegistrationGuardService } from './services/registration-guard.service';
import { LoginGuardService } from './services/login-guard.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'news', component: NewsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuardService] },
  { path: 'logout', component: LogoutComponent },
  { path: 'registration', component: RegistrationComponent, canActivate: [RegistrationGuardService] },
  { path: 'profile', component: ProfileComponent },
  { path: 'dashboard', component: AdminPageComponent, canActivate: [AuthenticationGuardService] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
