import { Component, computed, input } from '@angular/core';

// Resolution Tracker v4 - Compteur "X/3 confirmations degagement"
// (Frontend Specifications v4, section 2.5)
@Component({
  selector: 'app-resolution-tracker',
  imports: [],
  templateUrl: './resolution-tracker.html',
  styles: ``,
})
export class ResolutionTracker {
  confirmed = input.required<number>();
  required = input<number>(3);

  pourcentage = computed(() => Math.min((this.confirmed() / this.required()) * 100, 100));

  isComplete = computed(() => this.confirmed() >= this.required());
}
