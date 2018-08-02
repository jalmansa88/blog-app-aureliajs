import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { inject, signalBindings } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { Router } from 'aurelia-router';
import * as toastr from 'toastr';
import { AuthService } from './common/auth-service';
import { PostService } from './common/post-service';
import { AuthPipe } from './pipes/auth-pipe';
import { I18N } from 'aurelia-i18n';

@inject(PostService, AuthService, EventAggregator, I18N)
export class App {
  message: string;
  currentUser: any;
  tags: any;
  archives: any[];
  post: any;
  error: string;
  subscription: Subscription;
  postSubscription: Subscription;
  toastSubscription: Subscription;
  router: Router;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private eventAggregator: EventAggregator,
    private i18n: I18N
  ) {}

  attached() {
    this.currentUser = this.authService.currentUser;
    this.subscription = this.eventAggregator.subscribe('user', user => {
      this.currentUser = user;
    });

    this.updateSideBar();
    this.postSubscription = this.eventAggregator.subscribe(
      'post-updated',
      updatedAt => {
        this.updateSideBar();
      }
    );
    this.toastSubscription = this.eventAggregator.subscribe('toast', toast => {
      toastr[toast.type](toast.message);
    });
  }

  updateSideBar() {
    this.postService
      .allTags()
      .then((result: any) => {
        this.tags = result.tags;
      })
      .catch(err => {
        this.eventAggregator.publish('toast', {
          type: 'error',
          message: err.message
        });
      });

    this.postService
      .allArchives()
      .then((result: any) => {
        this.archives = result.archives;
      })
      .catch(err => {
        this.eventAggregator.publish('toast', {
          type: 'error',
          message: err.message
        });
      });
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = "Almansa's Blog";
    config.addAuthorizeStep(AuthPipe);
    config.map([
      {
        route: '',
        name: 'home',
        moduleId: PLATFORM.moduleName('components/posts/posts.component'),
        title: 'All Posts'
      },
      {
        route: 'login',
        name: 'login',
        moduleId: PLATFORM.moduleName('components/auth/login'),
        title: 'Login'
      },
      {
        route: 'signup',
        name: 'signup',
        moduleId: PLATFORM.moduleName('components/auth/signup'),
        title: 'Sign Up'
      },
      {
        route: 'create-post',
        name: 'create-post',
        moduleId: PLATFORM.moduleName('components/create/create'),
        title: 'Create Post',
        settings: { auth: true }
      },
      {
        route: 'post/:slug',
        name: 'post-detail',
        moduleId: PLATFORM.moduleName('components/posts/post-detail.component'),
        title: 'Post Detail'
      },
      {
        route: 'post/:slug/edit',
        name: 'post-edit',
        moduleId: PLATFORM.moduleName('components/edit/edit'),
        title: 'Post Edit',
        settings: { auth: true }
      },
      {
        route: 'tag/:tag',
        name: 'tag-detail',
        moduleId: PLATFORM.moduleName('components/tags/tag-detail'),
        title: 'View Post by Tag'
      },
      {
        route: 'archives/:archive',
        name: 'archive-detail',
        moduleId: PLATFORM.moduleName('components/archives/archive-detail'),
        title: 'View Post by Archive'
      }
    ]);
  }

  detached() {
    this.subscription.dispose();
    this.postSubscription.dispose();
    this.toastSubscription.dispose();
  }

  logout() {
    this.authService
      .logout()
      .then((result: any) => {
        this.eventAggregator.publish('user', null);
        this.router.navigateToRoute('home');
        this.eventAggregator.publish('toast', {
          type: 'success',
          message: 'Success Logout'
        });
      })
      .catch(err => {
        this.eventAggregator.publish('toast', {
          type: 'error',
          message: err.message
        });
      });
  }

  setLocale(locale) {
    this.i18n.setLocale(locale).then(result => {
      this.eventAggregator.publish('locale-changed', Date());
      signalBindings('locale-changed');
    });
  }
}
