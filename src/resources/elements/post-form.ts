import { bindable, inject } from 'aurelia-framework';
import { PostService } from 'common/post-service';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import {
  ValidationRules,
  ValidationControllerFactory,
  validationMessages
} from 'aurelia-validation';

@inject(PostService, EventAggregator, I18N, ValidationControllerFactory)
export class PostForm {
  @bindable post;
  @bindable title;

  tags: any[] = [];
  newTag: string;
  localeSubscription: Subscription;
  controller: any;

  constructor(
    private postS: PostService,
    private eventA: EventAggregator,
    private i18n: I18N,
    ValidationControllerFactory
  ) {
    this.controller = ValidationControllerFactory.createForCurrentScope();

    this.localeSubscription = this.eventA.subscribe(
      'locale-changed',
      updatedAt => {
        this.setValidation();
      }
    );
  }

  attached() {
    this.postS
      .allTags()
      .then((result: any) => {
        this.tags = result.tags;
      })
      .catch(err => {
        this.eventA.publish('toast', {
          type: 'error',
          message: err.message
        });
      });
  }

  detached() {
    this.localeSubscription.dispose();
  }

  addTag() {
    if (this.newTag) {
      this.tags.push(this.newTag);
      this.post.tags.push(this.newTag);
      console.log(this.post.tags);
      this.newTag = null;
    }
  }

  submit() {}

  postChanged(newValue, oldValue) {
    this.setValidation();
  }

  setValidation() {
    if (this.post) {
      validationMessages['required'] = this.i18n.tr('post-form:requiredField');
      ValidationRules.ensure('title')
        .displayName(this.i18n.tr('post-form:title'))
        .required()
        .minLength(5)
        .ensure('body')
        .displayName(this.i18n.tr('post-form:body'))
        .required()
        .on(this.post);
      this.controller.validate();
    }
  }
}
