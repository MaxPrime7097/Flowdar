import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, Inject, PLATFORM_ID, NgZone
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, Icon],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class Landing implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rippleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroRef') heroRef!: ElementRef<HTMLElement>;
  @ViewChild('heroWaterRef') heroWaterRef!: ElementRef<HTMLElement>;

  private isBrowser: boolean;
  private animationId = 0;
  private rippleInterval: any;
  private scrollHandler?: () => void;
  private revealObserver?: IntersectionObserver;
  private statObserver?: IntersectionObserver;

  navSolid = false;

  testimonials = [
    {
      name: 'Maricel T.',
      role: 'Infirmière, Bonabéri',
      quote: "Je travaille de nuit. Avant Flowdar, je devais appeler des amis pour savoir si la route était praticable. Maintenant j'ouvre l'app et je suis fixée.",
      avatar: 'M'
    },
    {
      name: 'Jean-Paul N.',
      role: 'Chauffeur de taxi, Douala',
      quote: "J'évite les zones inondées avant même de partir. Mes passagers me font confiance et mon véhicule est préservé.",
      avatar: 'J'
    },
    {
      name: 'Priscilla K.',
      role: 'Mère de famille, New-Bell',
      quote: "Mon quartier est souvent inondé en saison des pluies. Flowdar m'a sauvé deux fois de blocages interminables en une semaine.",
      avatar: 'P'
    },
    {
      name: 'Samuel E.',
      role: 'Enseignant, Makepe',
      quote: "L'alerte arrivée la veille m'a permis de changer mon trajet. Le lendemain matin la route était complètement sous l'eau.",
      avatar: 'S'
    },
  ];

  features = [
    {
      icone: 'activite' as const,
      titre: 'Alertes en temps réel',
      desc: 'Mises à jour instantanées via Supabase Realtime. Dès qu\'un quartier est inondé, tous les utilisateurs actifs sont notifiés en moins de 5 secondes.',
      couleur: 'blue'
    },
    {
      icone: 'localisation' as const,
      titre: 'Géolocalisation précise',
      desc: 'Chaque alerte est géolocalisée avec précision sur la carte. Vous savez exactement quelle rue est touchée, pas seulement quel quartier.',
      couleur: 'orange'
    },
    {
      icone: 'utilisateurs' as const,
      titre: 'Intelligence collective',
      desc: 'Le score de risque combine données météo, historique des inondations et confirmations citoyennes pour une fiabilité maximale.',
      couleur: 'green'
    },
    {
      icone: 'voiture' as const,
      titre: 'Itinéraires sécurisés',
      desc: 'Google Maps recalcule automatiquement votre trajet pour éviter les zones à risque. Arrivez à destination, quoi qu\'il arrive.',
      couleur: 'purple'
    },
    {
      icone: 'wifi' as const,
      titre: 'Fonctionne hors ligne',
      desc: 'Les données récentes sont mises en cache. Vous pouvez consulter les alertes même sans connexion internet, en zone de faible couverture.',
      couleur: 'teal'
    },
    {
      icone: 'cloche' as const,
      titre: 'Notifications push',
      desc: 'Recevez une alerte sur votre téléphone dès qu\'une zone proche de chez vous dépasse le seuil de risque, même si l\'app est fermée.',
      couleur: 'red'
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private zone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    this.zone.runOutsideAngular(() => {
      /* ── Canvas ripple animation (Hero) ── */
      const canvas = this.canvasRef?.nativeElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          let ripples: { x: number; y: number; r: number; max: number; alpha: number }[] = [];

          const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
          };
          resize();
          window.addEventListener('resize', resize);

          const addRipple = () => {
            ripples.push({
              x: canvas.width / 2,
              y: canvas.height / 2,
              r: 0,
              max: Math.max(canvas.width, canvas.height) * 0.7,
              alpha: 1
            });
          };
          addRipple();
          this.rippleInterval = setInterval(addRipple, 2200);

          const animateRipples = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ripples = ripples.filter(r => r.alpha > 0);
            ripples.forEach(r => {
              ctx.beginPath();
              ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(34,87,179,${r.alpha * 0.8})`;
              ctx.lineWidth = 1.5;
              ctx.stroke();
              r.r += 2.5;
              r.alpha = Math.max(0, 1 - r.r / r.max);
            });
            this.animationId = requestAnimationFrame(animateRipples);
          };
          animateRipples();
        }
      }

      /* ── Hero water elevation on scroll ── */
      this.scrollHandler = () => {
        const heroEl = this.heroRef?.nativeElement;
        const heroWaterEl = this.heroWaterRef?.nativeElement;
        const scrolled = window.scrollY;

        if (heroEl && heroWaterEl) {
          const heroH = heroEl.offsetHeight || 1;
          const pct = Math.min(scrolled / heroH, 1);
          heroWaterEl.style.height = (pct * 65) + '%';
        }

        const isSolid = scrolled > 80;
        if (this.navSolid !== isSolid) {
          this.zone.run(() => {
            this.navSolid = isSolid;
          });
        }
      };
      window.addEventListener('scroll', this.scrollHandler, { passive: true });

      /* ── IntersectionObserver: Scroll Reveal ── */
      const reveals = document.querySelectorAll('.reveal');
      this.revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            this.revealObserver?.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      reveals.forEach(el => this.revealObserver?.observe(el));

      /* ── IntersectionObserver: Counter Animation for Stats ── */
      const statNums = document.querySelectorAll('.stat-num');
      this.statObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const unit = el.querySelector('.unit');
            const unitHTML = unit ? unit.outerHTML : '';
            const text = el.textContent || '';
            const val = parseInt(text.replace(/\D/g, '')) || 0;
            const hasM = text.includes('M');
            let count = 0;
            const inc = val / 50;
            const t = setInterval(() => {
              count = Math.min(count + inc, val);
              const rounded = Math.round(count);
              if (hasM) {
                el.innerHTML = unitHTML + rounded + 'M+';
              } else {
                el.innerHTML = unitHTML + rounded;
              }
              if (count >= val) clearInterval(t);
            }, 20);
            this.statObserver?.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      statNums.forEach(el => this.statObserver?.observe(el));
    });
  }

  scoreClass(score: number): string {
    if (score > 70) return 'score-red';
    if (score > 40) return 'score-orange';
    return 'score-yellow';
  }

  scrollTo(id: string, event?: Event) {
    if (event) event.preventDefault();
    if (!this.isBrowser) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.rippleInterval) clearInterval(this.rippleInterval);
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
    if (this.revealObserver) this.revealObserver.disconnect();
    if (this.statObserver) this.statObserver.disconnect();
  }
}
