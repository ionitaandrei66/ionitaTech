import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';

import { EMAILJS_CONFIG } from '../shared/const/email-js';
import { ToastService } from '../shared/services/toast.service';
import { SceneComponent } from '../components/scene/scene.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule, SceneComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit, AfterViewInit {
  private requestNumber = 5;
  private isWheelLocked = false;

  private lastPageTouchY = 0;
  private lastPanelTouchY = 0;

  private readonly SCROLL_THRESHOLD = 10;
  private readonly WHEEL_LOCK_MS = 1050;
  private readonly MIN_WHEEL_DELTA = 18;
  private readonly MIN_TOUCH_DELTA = 6;

  public isScrolled = false;
  public emailUsGroup!: FormGroup;

  constructor(private _fb: FormBuilder, private toast: ToastService) {}

  get emailCtrl() {
    return this.emailUsGroup.get('email');
  }

  get emailInvalid(): boolean {
    const c = this.emailCtrl;
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  get nameCtrl() {
    return this.emailUsGroup.get('name');
  }

  get nameInvalid(): boolean {
    const c = this.nameCtrl;
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  get messageCtrl() {
    return this.emailUsGroup.get('message');
  }

  get messageInvalid(): boolean {
    const c = this.messageCtrl;
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  public ngOnInit(): void {
    this.emailUsGroup = this._fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required]],
      popLol: [null],
      message: [null, [Validators.required]],
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.it-section__panel').forEach((panel) => {
        panel.scrollTop = 0;
      });

      const container = document.querySelector<HTMLElement>('.it-scroll-content');
      container?.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  public onContentWheel(event: WheelEvent, container: HTMLElement): void {
    event.preventDefault();
    event.stopPropagation();

    this.handleSectionScroll(event.deltaY, container, this.MIN_WHEEL_DELTA);
  }

  public onPageTouchStart(event: TouchEvent): void {
    if (this.isEventInsidePanel(event)) {
      return;
    }

    this.lastPageTouchY = event.touches[0]?.clientY ?? 0;
  }

  public onPageTouchMove(event: TouchEvent, container: HTMLElement): void {
    if (this.isEventInsidePanel(event)) {
      return;
    }

    const currentY = event.touches[0]?.clientY ?? 0;
    const delta = this.lastPageTouchY - currentY;

    if (Math.abs(delta) < this.MIN_TOUCH_DELTA) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.lastPageTouchY = currentY;
    this.handleSectionScroll(delta * 2.4, container, this.MIN_TOUCH_DELTA);
  }

  public onPanelWheel(event: WheelEvent): void {
    const panel = event.currentTarget as HTMLElement;

    event.preventDefault();
    event.stopPropagation();

    panel.scrollTop += event.deltaY;
  }

  public onPanelTouchStart(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.lastPanelTouchY = event.touches[0]?.clientY ?? 0;
  }

  public onPanelTouchMove(event: TouchEvent): void {
    const panel = event.currentTarget as HTMLElement;
    const currentY = event.touches[0]?.clientY ?? 0;
    const delta = this.lastPanelTouchY - currentY;

    event.preventDefault();
    event.stopPropagation();

    this.lastPanelTouchY = currentY;
    panel.scrollTop += delta;
  }

  public onContentScroll(container: HTMLElement): void {
    this.isScrolled = container.scrollTop > this.SCROLL_THRESHOLD;
  }

  public scrollToSection(section: HTMLElement): void {
    const container = document.querySelector<HTMLElement>('.it-scroll-content');

    if (!container) {
      return;
    }

    this.rotatePlanet(900);

    container.scrollTo({
      top: section.offsetTop,
      behavior: 'smooth',
    });
  }

  private handleSectionScroll(delta: number, container: HTMLElement, minDelta: number): void {
    if (Math.abs(delta) < minDelta || this.isWheelLocked) {
      return;
    }

    const direction: 1 | -1 = delta > 0 ? 1 : -1;

    this.rotatePlanet(delta);

    const sections = Array.from(container.querySelectorAll<HTMLElement>('.it-section'));
    const activeIndex = this.getActiveSectionIndex(container, sections);
    const nextIndex = Math.max(0, Math.min(sections.length - 1, activeIndex + direction));

    if (nextIndex === activeIndex) {
      return;
    }

    this.isWheelLocked = true;

    this.rotatePlanet(direction * 900);

    container.scrollTo({
      top: sections[nextIndex].offsetTop,
      behavior: 'smooth',
    });

    setTimeout(() => {
      this.isWheelLocked = false;
    }, this.WHEEL_LOCK_MS);
  }

  private rotatePlanet(delta: number): void {
    window.dispatchEvent(
      new CustomEvent('planet-scroll', {
        detail: {
          delta,
          force: Math.sign(delta) * 1.8,
        },
      }),
    );
  }

  private getActiveSectionIndex(container: HTMLElement, sections: HTMLElement[]): number {
    const scrollTop = container.scrollTop;
    let activeIndex = 0;
    let smallestDistance = Number.MAX_SAFE_INTEGER;

    sections.forEach((section, index) => {
      const distance = Math.abs(section.offsetTop - scrollTop);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        activeIndex = index;
      }
    });

    return activeIndex;
  }

  private isEventInsidePanel(event: Event): boolean {
    return !!(event.target as HTMLElement | null)?.closest('.it-section__panel');
  }

  public sendEmail(): void {
    if (this.emailUsGroup.invalid) {
      this.emailUsGroup.markAllAsTouched();
      return;
    }

    if (this.emailUsGroup.controls['popLol']?.value === null && this.requestNumber > 0) {
      emailjs
        .send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            name: this.emailUsGroup.controls['name'].value,
            email: this.emailUsGroup.controls['email'].value,
            message: this.emailUsGroup.controls['message'].value,
          },
          {
            publicKey: EMAILJS_CONFIG.publicKey,
          },
        )
        .then(() => {
          this.toast.success('Message sent successfully!', { title: 'Success' });
          this.emailUsGroup.reset();
          this.requestNumber -= 1;
        })
        .catch(() => {
          this.toast.error('Something went wrong. Please try again.', { title: 'Error' });
        });
    }
  }
}
