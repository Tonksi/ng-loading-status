import { Injectable } from '@angular/core';
import {
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  Router,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class LoadingStatusService {
  private loadingRouteConfig = false;
  private subj = new BehaviorSubject(false);
  private loadingEvents: Set<string> = new Set();

  public get loading$() {
    return this.subj.asObservable();
  }

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingRouteConfig = false;
      }
      this.determineStatus();
    });
  }

  public start(id?: string): string {
    if (!id) {
      id = uuid();
    }
    this.loadingEvents.add(id);
    this.determineStatus();
    return id;
  }

  public complete(id: string): void {
    this.loadingEvents.delete(id);
    this.determineStatus();
  }

  private determineStatus() {
    if (this.loadingRouteConfig || this.loadingEvents.size > 0) {
      this.subj.next(true);
    } else {
      this.subj.next(false);
    }
  }
}
