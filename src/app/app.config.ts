import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideIcons } from '@ng-icons/core';
import {
  lucideMap, lucideShield, lucideNavigation, lucideClock, lucideUser,
  lucideTriangleAlert, lucideCircle, lucideOctagonAlert, lucideCircleAlert, lucideX, lucidePlus,
  lucideCircleCheck,lucideWavesHorizontal,lucideBell, lucideArrowLeft, lucideSearch, lucideMapPin,
  lucideMail, lucideLock, lucideEye, lucideSend, lucideCamera, lucideLayers,
  lucideLocate, lucideSiren, lucideUsers, lucideChevronRight, lucideChevronLeft,
  lucideChevronDown, lucideFilter, lucideTrendingUp, lucideRoute, lucideCloudRain,
  lucideCloud, lucideCloudLightning, lucidePhone, lucideDroplets, lucideZap,
  lucideBriefcaseMedical, lucideBot, lucideMegaphone, lucideSatellite,
  lucideSmartphone, lucideWifi, lucideActivity, lucideAward, lucideCheckCircle2
} from '@ng-icons/lucide';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideIcons({
      lucideMap, lucideShield, lucideNavigation, lucideClock, lucideUser,
      lucideTriangleAlert, lucideCircle, lucideOctagonAlert, lucideCircleAlert, lucideX, lucidePlus,
      lucideCircleCheck, lucideWavesHorizontal, lucideBell, lucideArrowLeft, lucideSearch, lucideMapPin,
      lucideMail, lucideLock, lucideEye, lucideSend, lucideCamera, lucideLayers,
      lucideLocate, lucideSiren, lucideUsers, lucideChevronRight, lucideChevronLeft,
      lucideChevronDown, lucideFilter, lucideTrendingUp, lucideRoute, lucideCloudRain,
      lucideCloud, lucideCloudLightning, lucidePhone, lucideDroplets, lucideZap,
      lucideBriefcaseMedical, lucideBot, lucideMegaphone, lucideSatellite,
      lucideSmartphone, lucideWifi, lucideActivity, lucideAward, lucideCheckCircle2
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
