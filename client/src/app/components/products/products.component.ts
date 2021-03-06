import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageTitleService } from '../../services/page-title.service';
import { Product } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { NewsService } from '../../services/news-service';
import { News } from '../../models/news.model';
import { UserRegistrationService } from '../../services/user-registration.service';
import { User } from '../../models/users.model';
import { Comment } from '../../models/comment.model';
import { CommentsService } from '../../services/comments.service';
import { AuthenticationService } from '../../services/authentication.service';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  productsLink: string;
  products: Product[];
  news: News[];
  p: number = 1;
  q: number = 1;
  authenticateUser: User;
  isNewComment: boolean;
  userRoleArr: any;
  userRole: any;
  userComment: Comment;
  commentsForProduct: Comment[];

  getProductsSubscription: Subscription;
  getNewsSubscription: Subscription;
  getProductCommentsSubscription: Subscription;
  postCommentsSubscription: Subscription;
  putCommentsSubscription: Subscription;
  deleteCommentSubscription: Subscription;
  getAuthSubscription: Subscription;

  constructor( private pageTitle: PageTitleService,
               private productsService: ProductsService,
               private newsService: NewsService,
               private registrationService: UserRegistrationService,
               public authenticationService: AuthenticationService,
               private commentsService: CommentsService,
               private globalVariables: GlobalVariablesService ) { }

  ngOnInit() {
    this.pageTitle.setTitle('Coffee Products - Products');
    this.authenticateUser = new User();
    this.userComment = new Comment();
    this.getAllProducts();
    this.getAllNews();
    this.checkLoggedInUser();
  }

  ngOnDestroy() {
    if (this.getProductsSubscription) {this.getProductsSubscription.unsubscribe();}
    if (this.getNewsSubscription) {this.getNewsSubscription.unsubscribe();}
    if (this.getProductCommentsSubscription) {this.getProductCommentsSubscription.unsubscribe();}
    if (this.postCommentsSubscription) {this.postCommentsSubscription.unsubscribe();}
    if (this.putCommentsSubscription) {this.putCommentsSubscription.unsubscribe();}
    if (this.deleteCommentSubscription) {this.deleteCommentSubscription.unsubscribe();}
    if (this.getAuthSubscription) {this.getAuthSubscription.unsubscribe();}
  }

  getAllProducts() {
    this.getProductsSubscription = this.productsService.getProducts().subscribe(
      products => {
        let localStorageLang = localStorage.getItem('translationLang');
        let currentLang = localStorageLang ? localStorageLang : this.globalVariables.siteLanguage;
        this.products = products.filter(productLang => productLang.language == currentLang);
      }
    );
  }

  activeProduct(product: string) {
    this.productsLink = product;
  }

  getAllNews() {
    this.getNewsSubscription = this.newsService.getNews().subscribe(
      news => {
        let localStorageLang = localStorage.getItem('translationLang');
        let currentLang = localStorageLang ? localStorageLang : this.globalVariables.siteLanguage;
        this.news = news.filter(articleLang => articleLang.language == currentLang);
      });
  }

  loadUserData() {
    let userMail: any = sessionStorage.getItem('username');
    this.getAuthSubscription = this.registrationService.getAuthenticatedUser(userMail).subscribe(
      userData => {
        this.authenticateUser = userData;
        this.userRoleArr = this.authenticateUser.roles;
        this.userRole = this.userRoleArr[0].role;
      }, () => {

      });
  }

  checkLoggedInUser() {
    let loggedInUser: any = sessionStorage.getItem('username');
    if (loggedInUser) {
      this.loadUserData();
    } else {

    }
  }

  showCommentForm(productID: any) {
    this.isNewComment = true;
    let commentForm = document.getElementById('comment-form' + productID);
    commentForm.classList.remove('comment-form-hidden');
    commentForm.classList.add('comment-form-visible');
  }

  commentProduct(productID: number) {
    this.userComment.productId = productID;
    this.userComment.userId = this.authenticateUser.id;
    this.userComment.fullName = this.authenticateUser.userName + this.authenticateUser.lastName;
    if(this.isNewComment) {
      this.postCommentsSubscription = this.commentsService.postComment(this.userComment).subscribe(
        () => {
          console.log('Yes');
        }, () => {
          console.log('No');
        });
    } else {
      this.putCommentsSubscription = this.commentsService.putComment(this.userComment).subscribe(
        () => {
          console.log('Yes');
        }, () => {
          console.log('No');
        });
    }
  }

  getAllCommentsForProduct(productID: number) {
    this.getProductCommentsSubscription = this.commentsService.getProductsComments(productID).subscribe(
      allComments => {
        this.commentsForProduct = allComments;
      }, () => {

      });
  }

  editComment(comment: Comment) {
    this.isNewComment = false;
    let commentForm = document.getElementById('comment-form');
    commentForm.classList.remove('comment-form-hidden');
    commentForm.classList.add('comment-form-visible');
    this.userComment = new Comment(
      comment.id,
      comment.commentText,
      comment.productId,
      comment.newsId,
      comment.userId,
      comment.fullName
    );
  }

  removeComment(commentID: number) {
    this.deleteCommentSubscription = this.commentsService.deleteComment(commentID).subscribe(
      () => {
        console.log('YES');
      }, () => {
        console.log('NO');
      });
  }

  showDeleteConfirmation(comment_ID) {
    let deleteTooltip = document.getElementById(comment_ID);
    deleteTooltip.classList.add('delete-confirmation-visible');
    deleteTooltip.classList.remove('delete-confirmation-hidden');
  }

  hideDeleteConfirmation(comment_ID) {
    let deleteTooltip = document.getElementById(comment_ID);
    deleteTooltip.classList.add('delete-confirmation-hidden');
    deleteTooltip.classList.remove('delete-confirmation-visible');
  }

}
