import { TestBed } from '@angular/core/testing';
import {
  Route,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';

import { LoadingStatusService } from './loading-status.service';
import { NgLoadingStatusModule } from './ng-loading-status.module';

describe('LoadingStatusService', () => {
  let service: LoadingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgLoadingStatusModule, RouterTestingModule],
    });
    service = TestBed.inject(LoadingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to false', (done) => {
    service.loading$.subscribe((status) => {
      expect(status).toEqual(false);
      done();
    });
  });

  describe('loading status when starting and completing loading events (used in http requests)', () => {
    it('should be true started but not completed', (done) => {
      let id = service.start();

      service.loading$.subscribe((status) => {
        expect(status).toEqual(true);
        done();
      });
    });

    it('should be false when started and completed', (done) => {
      let id = service.start();
      service.complete(id);

      service.loading$.subscribe((status) => {
        expect(status).toEqual(false);
        done();
      });
    });

    it('should be true started but not completed (with pre-defined id)', (done) => {
      let id = '1';
      service.start(id);

      service.loading$.subscribe((status) => {
        expect(status).toEqual(true);
        done();
      });
    });

    it('should be false when started and completed (with pre-defined id)', (done) => {
      let id = '1';
      service.start(id);
      service.complete(id);

      service.loading$.subscribe((status) => {
        expect(status).toEqual(false);
        done();
      });
    });

    it('should be false when many actions being started and completed', (done) => {
      let id1 = service.start();
      let id2 = service.start();
      let id3 = service.start();
      let id4 = service.start();
      service.complete(id1);
      service.complete(id2);
      service.complete(id3);
      service.complete(id4);

      service.loading$.subscribe((status) => {
        expect(status).toEqual(false);
        done();
      });
    });

    it('should be true when many actions being started and partially completed', (done) => {
      let id1 = service.start();
      let id2 = service.start();
      let id3 = service.start();
      let id4 = service.start();
      service.complete(id1);
      service.complete(id2);
      service.complete(id4);

      service.loading$.subscribe((status) => {
        expect(status).toEqual(true);
        done();
      });
    });
  });

  describe('loading status when lazy loading (navigating to a lazy loaded page)', () => {
    it('should be true when lazy loading begins', (done) => {
      const event = new RouteConfigLoadStart('' as Route);
      ((TestBed.inject(Router)
        .events as unknown) as Subject<RouteConfigLoadStart>).next(event);

      service.loading$.subscribe((status) => {
        expect(status).toEqual(true);
        done();
      });
    });

    it('should be false when lazy loading begins and then completes', (done) => {
      const event1 = new RouteConfigLoadStart('' as Route);
      ((TestBed.inject(Router)
        .events as unknown) as Subject<RouteConfigLoadStart>).next(event1);

      const event2 = new RouteConfigLoadEnd('' as Route);
      ((TestBed.inject(Router)
        .events as unknown) as Subject<RouteConfigLoadEnd>).next(event2);

      service.loading$.subscribe((status) => {
        expect(status).toEqual(false);
        done();
      });
    });
  });
});
