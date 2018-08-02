import { inject } from 'aurelia-framework';
import { PostService } from '../../common/post-service';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(PostService, EventAggregator)
export class PostsComponent {
  message: string;
  posts: any[];

  constructor(
    private postService: PostService,
    private eventA: EventAggregator
  ) {}

  attached() {
    this.postService
      .allPostPreviews()
      .then((result: any) => {
        this.posts = result.posts;
      })
      .catch(err => {
        this.eventA.publish('toast', {
          type: 'error',
          message: err.message
        });
      });
  }
}
