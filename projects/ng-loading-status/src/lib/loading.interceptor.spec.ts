import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { LoadingStatusService } from './loading-status.service';
import { RouterTestingModule } from '@angular/router/testing';
import { spy, verify, when } from 'ts-mockito';
import { NgLoadingStatusModule } from './ng-loading-status.module';

describe(`LoadingInterceptor`, () => {
  let service: LoadingStatusService;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgLoadingStatusModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    });

    service = TestBed.inject(LoadingStatusService);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should start and complete the transaction through the loading service (success)', (done) => {
    let spiedService = spy(service);
    when(spiedService.start()).thenReturn('fake-id');

    http.get('').subscribe(() => {
      setTimeout(() => {
        verify(spiedService.start()).once();
        verify(spiedService.complete('fake-id')).once();
        expect().nothing(); // avoid warnings
        done();
      }, 0); // needed for event loop
    });

    const request = httpMock.expectOne(``);
    request.flush({});
  });

  it('should start and complete the transaction through the loading service (bad request)', (done) => {
    let spiedService = spy(service);
    when(spiedService.start()).thenReturn('fake-id');
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

    http.get('').subscribe(
      () => {},
      () => {
        setTimeout(() => {
          verify(spiedService.start()).once();
          verify(spiedService.complete('fake-id')).once();
          expect().nothing(); // avoid warnings
          done();
        }, 0); // needed for event loop
      }
    );

    const request = httpMock.expectOne(``);
    request.flush({}, mockErrorResponse);
  });
});
