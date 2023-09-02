import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/article';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-article-overview',
  templateUrl: './article-overview.component.html',
  styleUrls: ['./article-overview.component.css']
})
export class ArticleOverviewComponent implements OnInit {

  articles: Article[];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.dashboardService.getArticles().subscribe(articles => {
      this.articles = articles;
    })
  }

  togglePublishState(article: Article): void {
    article.published = !article.published;
    this.dashboardService.togglePublishState(article).subscribe(
      result => {
        const index: number = this.articles.findIndex(
          currentArticle => currentArticle.id === result.id
        );
        this.articles[index] = result;
      },
      error => {
        article.published = !article.published;
        console.log(error);
      });
  }

}
