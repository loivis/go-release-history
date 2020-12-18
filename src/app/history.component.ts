import { Component, Input, OnInit } from '@angular/core';
import { DataService } from './data.service';

// minor release version, such as go1.16
export type release = {
  name: string;
  milestones: milestone[];
};

type milestone = {
  name: string;
  link: string;
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
export class HistoryComponent implements OnInit {
  @Input() name: string;

  release: release;

  constructor(private service: DataService) {}

  ngOnInit(): void {
    this.service
      .getMilestones(this.name)
      .subscribe((release) => (this.release = release));
  }
}
