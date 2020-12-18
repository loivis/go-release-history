import { Component } from '@angular/core';

export interface Tab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  tabs = ['Go', 'Gopls', 'Other'];
  activeTab = this.tabs[0];
}
