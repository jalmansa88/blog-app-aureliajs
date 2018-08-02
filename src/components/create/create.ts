import { inject } from '../../../node_modules/aurelia-framework';
import { PostService } from 'common/post-service';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(PostService, Router, EventAggregator)
export class Create {
  post = {
    title: '',
    body: '',
    tags: []
  };
  tags: any[] = [];
  newTag: string;
  title: string;

  constructor(
    private postS: PostService,
    private router: Router,
    private eventA: EventAggregator
  ) {}

  attached() {
    this.title = 'createPost';
  }
  createPost() {
    this.postS
      .create(this.post)
      .then((result: any) => {
        this.eventA.publish('toast', {
          type: 'success',
          message: 'Post Created'
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
