import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {NgModule} from '@angular/core';

const notifierCustomOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
      // distance: 50,
    },
    vertical: {
      position: 'bottom',
      distance: 40,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: false,
    stacking: 2,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease',
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};

@NgModule({
  imports: [NotifierModule.withConfig(notifierCustomOptions)],
  exports: [NotifierModule]
})
export class NotificationModule { }
