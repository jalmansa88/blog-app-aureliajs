import * as moment from 'moment';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';

@inject(I18N)
export class DateFormatValueConverter {
  signals = ['locale-changed'];

  constructor(private i18n: I18N) {}

  toView(value) {
    moment.locale(this.i18n.getLocale());
    return moment(value).format('MMMM Do, YYYY, h:mm a');
  }

  fromView(value) {}
}
