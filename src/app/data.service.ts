import { Injectable, OnInit } from '@angular/core';
import { Octokit } from '@octokit/rest';
import { Observable, of } from 'rxjs';
import { milestone, release } from './history.component';

type regexp = {
  release: RegExp;
  major: RegExp;
  minor: RegExp;
  patch: RegExp;
};
@Injectable({
  providedIn: 'root',
})
export class DataService {
  readonly owner: string = 'golang';
  readonly repo: string = 'go';

  private ok: Octokit;

  private cachedMilestones: any[] = []; // milestones from github api response

  constructor() {
    this.ok = new Octokit({});
  }

  async cacheMilestones(): Promise<void> {
    const data = await this.ok.paginate(this.ok.issues.listMilestones, {
      owner: this.owner,
      repo: this.repo,
      state: 'closed',
      per_page: 100,
    });

    data.forEach((milestone) => {
      if (
        this.cachedMilestones.findIndex((cm) => cm.title == milestone.title) ==
        -1
      ) {
        this.cachedMilestones.push(milestone);
      }
    });
  }

  async getReleases(category: string): Promise<release[]> {
    let releases: release[] = [];

    if (this.cachedMilestones.length == 0) {
      await this.cacheMilestones();
    }

    switch (category.toLowerCase()) {
      case 'go':
        releases = this.semanticVersioning({
          release: /Go\d+(\.\d+)*$/,
          major: /Go\d+$/,
          minor: /Go\d+\.\d+$/,
          patch: /Go\d+(\.\d+){2}$/,
        });
        break;
      case 'gopls':
        releases = this.semanticVersioning({
          release: /gopls\/v\d+(\.\d+)*$/,
          major: /gopls\/v\d+$/,
          minor: /gopls\/v\d+\.\d+$/,
          patch: /gopls\/v\d+(\.\d+){2}$/,
        });
        break;
    }

    this.sortReleases(releases);

    return new Promise((resolve) => {
      resolve(releases);
    });
  }

  semanticVersioning(re: regexp): release[] {
    let releases: release[] = [];

    this.cachedMilestones.forEach((cm) => {
      if (cm.title.match(re.release)) {
        var minorName: string;

        if (cm.title.match(re.patch)) {
          minorName = cm.title.split('.').slice(0, -1).join('.');
        } else if (cm.title.match(re.minor)) {
          minorName = cm.title;
        } else if (cm.title.match(re.major)) {
          minorName = cm.title + '.0';
        }

        var found = releases.find((milestone) => milestone.name == minorName);
        var element = {
          name: cm.title,
          link: cm.html_url + '?closed=1',
          closedAt: cm.closed_at,
          issues: [],
        };

        if (found == undefined) {
          releases.push({
            name: minorName,
            milestones: [element],
          });
        } else {
          found.milestones.push(element);
        }
      }
    });

    return releases;
  }

  sortReleases(releases: release[]): void {
    releases
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      )
      .reverse();

    releases.forEach((release) => {
      if (release.name.startsWith('Go') || release.name.startsWith('gopls')) {
        release.milestones
          .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { numeric: true })
          )
          .reverse();
      } else {
        release.milestones.sort((a, b) => {
          if (a.closedAt > b.closedAt) {
            return -1;
          }
          if (a.closedAt < b.closedAt) {
            return 1;
          }
          return 0;
        });
      }
    });
  }
}
