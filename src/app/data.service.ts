import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { release } from './history.component';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private milestones = new Map([
    [
      'go',
      {
        name: 'go1.16',
        milestones: [
          {
            name: 'go1.16',
            link: 'https://github.com/golang/go/go1.16',
            issues: [
              {
                title: '1.16 issue 1',
                link: 'https://github.com/golang/go/1.16/issues/1',
              },
              {
                title: '1.16 issue 2',
                link: 'https://github.com/golang/go/1.16/issues/2',
              },
            ],
          },
          {
            name: 'go1.16.1',
            link: 'https://github.com/golang/go/go1.16.1',
            issues: [
              {
                title: '1.16.1 issue 1',
                link: 'https://github.com/golang/go/1.16.1/issues/1',
              },
              {
                title: '1.16.1 issue 2',
                link: 'https://github.com/golang/go/1.16.1/issues/2',
              },
            ],
          },
        ],
      },
    ],
  ]);

  constructor() {}

  getMilestones(category: string): Observable<release> {
    return of(this.milestones.get(category.toLowerCase()));
  }
}
