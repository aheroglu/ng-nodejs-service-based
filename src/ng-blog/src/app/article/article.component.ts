import { Component, OnInit } from '@angular/core';
import { Article } from '../article';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../article.service';
import { Meta, Title } from '@angular/platform-browser';
import { SharedService } from '../shared.service';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  article: Article = new Article();

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private router: Router,
    private titleService: Title,
    private sharedService: SharedService,
    private meta: Meta,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const key = params['key'];

      if (this.router.url.indexOf("dashboard/preview") === -1) {
        this.articleService.getArticle(key).subscribe(article => {
          this.displayArticle(article);
        });
      } else {
        this.dashboardService.getArticle(key).subscribe(article => {
          this.displayArticle(article);
        });
      }
    });
  }

  displayArticle(article: Article): void {
    if (article === null) {
      this.router.navigate(['/404']);
      return;
    }
    this.article = article;
    this.titleService.setTitle(
      `${this.article.title} - ${this.sharedService.blogTitle}`
    );
    this.meta.addTags([
      { name: 'description', content: this.article.description },
      { name: 'og:title', content: `${this.article.title} - ${this.sharedService.blogTitle}` },
      { name: 'og:type', content: 'website' },
      { name: 'og:url', content: this.sharedService.baseUrl + this.article.key },
      { name: 'og:image', content: this.article.imageUrl },
      { name: 'og:description', content: this.article.description },
      { name: 'og:sitename', content: this.sharedService.blogTitle }
    ])
  }

}
