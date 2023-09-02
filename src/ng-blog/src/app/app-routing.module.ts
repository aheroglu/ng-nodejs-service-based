import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { AboutComponent } from './about/about.component';
import { ArticleComponent } from './article/article.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditArticleComponent } from './dashboard/edit-article/edit-article.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: ArticleListComponent },
  { path: 'articles', component: ArticleListComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard/:key', component: EditArticleComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard/preview/:key', component: ArticleComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: '404', component: NotFoundComponent },
  { path: 'about', component: AboutComponent },
  { path: ':key', component: ArticleComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
