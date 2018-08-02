import { inject } from 'aurelia-framework';
import { PostService } from 'common/post-service';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(PostService, EventAggregator)
export class TagDetail {
  tag: any;
  posts: any[];

  constructor(
    private postService: PostService,
    private eventAggregator: EventAggregator
  ) {}

  activate(params) {
    this.tag = params.tag;
    this.postService
      .postsByTag(this.tag)
      .then((result: any) => {
        this.posts = result.posts;
      })
      .catch(err => {
        this.eventAggregator.publish('toast', {
          type: 'error',
          message: err.message
        });
      });
  }
}
