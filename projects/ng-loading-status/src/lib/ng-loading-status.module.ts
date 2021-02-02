import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LoadingStatusService } from './loading-status.service';
import { LoadingInterceptor } from './loading.interceptor';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    LoadingStatusService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  exports: [],
})
export class NgLoadingStatusModule {}
