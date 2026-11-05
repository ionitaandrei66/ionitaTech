import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  host: { class: 'it-reveal' },
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private static readonly VISIBLE_CLASS = 'it-reveal--visible';

  private readonly element: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private observer?: IntersectionObserver;

  public ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.reveal();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.reveal();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );

    this.observer.observe(this.element);
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private reveal(): void {
    this.element.classList.add(RevealOnScrollDirective.VISIBLE_CLASS);
    this.observer?.disconnect();
  }
}
