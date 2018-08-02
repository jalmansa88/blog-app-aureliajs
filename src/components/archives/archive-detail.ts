import { inject } from '../../../node_modules/aurelia-framework';
import { PostService } from 'common/post-service';
import { EventAggregator } from '../../../node_modules/aurelia-event-aggregator';

@inject(PostService, EventAggregator)
export class TagDetail {
  archive: any;
  posts: any[];
  title: string;

  constructor(
    private postService: PostService,
    private eventAggregator: EventAggregator
  ) {}

  activate(params) {
    this.archive = params.archive;
    this.postService
      .postsByArchive(this.archive)
      .then((result: any) => {
        this.posts = result.posts;
      })
      .catch(err => {
        console.error();
        this.eventAggregator.publish('toast', {
          type: 'error',
          message: err.message
        });
      });
  }
}
