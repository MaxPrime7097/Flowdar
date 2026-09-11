import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './legal.html',
  styleUrl: './legal.css'
})
export class Legal implements OnInit {
  private route = inject(ActivatedRoute);

  public currentDoc = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('doc') || 'mentions')
    ),
    { initialValue: 'mentions' }
  );

  public navItems = [
    { id: 'mentions', label: 'Mentions Légales' },
    { id: 'cgu', label: 'Conditions d\'Utilisation' },
    { id: 'privacy', label: 'Politique de Confidentialité' }
  ];

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
