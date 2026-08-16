import { Component, OnInit, output, signal } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../../core/firebase';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.html',
})
export class Splash implements OnInit {
  readonly pret = output<void>();
  readonly disparait = signal(false);

  ngOnInit() {
    const desabonner = onAuthStateChanged(firebaseAuth, () => {
      desabonner();
      this.disparait.set(true);
      setTimeout(() => this.pret.emit(), 5000);
    });
  }
}
