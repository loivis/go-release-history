import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DataService } from './data.service';

// minor release version, such as go1.16
export type release = {
  name: string;
  milestones: milestone[];
};

export type milestone = {
  name: string;
  link: string;
  closedAt: string;
  issues: issue[];
};

type issue = {
  title: string;
  link: string;
};

@Component({
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit, OnChanges {
  @Input() name: string;

  releases: release[];

  constructor(private service: DataService) {}

  ngOnInit(): void {
    // this.service
    //   .getMilestones(this.name)
    //   .subscribe((releases) => (this.releases = releases));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue) {
      this.name = changes.data.currentValue;
    }

    console.log(this.name);

    this.service
      .getReleases(this.name)
      .then((releases) => (this.releases = releases));
  }
}
