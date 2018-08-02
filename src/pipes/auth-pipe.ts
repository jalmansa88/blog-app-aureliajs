import { Redirect } from 'aurelia-router';
import { inject } from '../../node_modules/aurelia-framework';
import { AuthService } from '../common/auth-service';

@inject(AuthService)
export class AuthPipe {
  constructor(private authS: AuthService) {}

  run(navigationInstruction, next) {
    if (
      navigationInstruction
        .getAllInstructions()
        .some(i => i.config.settings.auth)
    ) {
      if (!this.authS.currentUser) {
        return next.cancel(new Redirect('login'));
      }
    }
    return next();
  }
}
