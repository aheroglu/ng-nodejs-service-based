import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { AboutComponent } from './about/about.component';
import { ArticleComponent } from './article/article.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticleOverviewComponent } from './dashboard/article-overview/article-overview.component';
import { EditArticleComponent } from './dashboard/edit-article/edit-article.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { Interceptor } from './interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    ArticleListComponent,
    AboutComponent,
    ArticleComponent,
    NotFoundComponent,
    DashboardComponent,
    ArticleOverviewComponent,
    EditArticleComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
