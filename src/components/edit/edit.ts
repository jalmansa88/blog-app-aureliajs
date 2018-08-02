import { inject } from '../../../node_modules/aurelia-framework';
import { PostService } from 'common/post-service';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthService } from '../../common/auth-service';

@inject(PostService, AuthService, Router, EventAggregator)
export class Edit {
  tags: any[] = [];
  newTag: string;
  title: string;
  post: any;

  constructor(
    private postS: PostService,
    private authS: AuthService,
    private router: Router,
    private eventA: EventAggregator
  ) {}

  activate(params) {
    this.postS
      .find(params.slug)
      .then((result: any) => {
        if (result.post.author !== this.authS.currentUser) {
          this.router.navigateToRoute('home');
        }
        this.post = result.post;
      })
      .catch(err => {
        this.eventA.publish('toast', {
          type: 'error',
          message: err.message
        });
        this.router.navigateToRoute('home');
      });
    this.title = 'editPost';
  }

  editPost() {
    this.postS
      .update(this.post)
      .then((result: any) => {
        this.eventA.publish('toast', {
          type: 'success',
          message: 'Post Edited'
        });
        this.eventA.publish('post-updated', Date());
        this.router.navigateToRoute('post-detail', { slug: result.slug });
      })
      .catch(err => {
        this.eventA.publish('toast', {
          type: 'error',
          message: err.message
        });
      });
  }
}
