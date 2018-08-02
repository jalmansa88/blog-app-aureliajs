import { inject } from 'aurelia-framework';
import { AuthService } from '../../common/auth-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

@inject(AuthService, Router, EventAggregator)
export class Signup {
  name: string;

  constructor(
    private authS: AuthService,
    private router: Router,
    private eventA: EventAggregator
  ) {}

  signup() {
    this.authS
      .signup(this.name)
      .then((result: any) => {
        console.log('success siguin up');
        this.eventA.publish('user', result.name);
        this.router.navigateToRoute('home');
      })
      .catch(err => {
        this.eventA.publish('toast', {
          type: 'error',
          message: err.message
        });
      });
  }
}
