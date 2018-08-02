import { inject } from '../../../node_modules/aurelia-framework';
import { PostService } from 'common/post-service';
import { AuthService } from '../../common/auth-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

@inject(AuthService, PostService, EventAggregator, Router)
export class PostDetailComponent {
  post: any;

  constructor(
    public authS: AuthService,
    private postService: PostService,
    private eventA: EventAggregator,
    private router: Router
  ) {}

  activate(params) {
    this.postService
      .find(params.slug)
      .then((result: any) => {
        console.log(result);
        this.post = result.post;
      })
      .catch(err => {
        this.eventA.publish('toast', {
          type: 'error',
          message: err.message
        });
        this.router.navigateToRoute('home');
      });
  }
}
