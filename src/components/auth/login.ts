import { inject } from 'aurelia-framework';
import { AuthService } from '../../common/auth-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

@inject(AuthService, Router, EventAggregator)
export class Login {
  name: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventAggregator: EventAggregator
  ) {}

  login() {
    this.authService
      .login(this.name)
      .then((result: any) => {
        this.eventAggregator.publish('user', result.user);
        this.router.navigateToRoute('home');
      })
      .catch(err => {
        this.eventAggregator.publish('toast', {
          type: 'error',
          message: err.message
        });
      });
  }
}
