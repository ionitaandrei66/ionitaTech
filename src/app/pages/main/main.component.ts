import { Component, OnInit } from '@angular/core';
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
export class MainComponent implements OnInit {
  private requestNumber = 5;
  private isWheelLocked = false;
  private pendingSectionDirection: 1 | -1 | 0 = 0;

  private readonly SCROLL_THRESHOLD = 10;
  private readonly WHEEL_LOCK_MS = 1050;
  private readonly MIN_WHEEL_DELTA = 18;

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

  public onContentWheel(event: WheelEvent, container: HTMLElement): void {
    event.preventDefault();
    event.stopPropagation();

    const delta = event.deltaY;

    if (Math.abs(delta) < this.MIN_WHEEL_DELTA) {
      return;
    }

    this.rotatePlanet(delta);

    const direction: 1 | -1 = delta > 0 ? 1 : -1;
    const sections = Array.from(container.querySelectorAll<HTMLElement>('.it-section'));
    const activeIndex = this.getActiveSectionIndex(container, sections);
    const activeSection = sections[activeIndex];
    const activePanel = activeSection?.querySelector<HTMLElement>('.it-section__panel');

    if (activePanel && this.scrollPanelIfPossible(activePanel, delta)) {
      this.pendingSectionDirection = 0;
      return;
    }

    if (activePanel && this.panelHasScroll(activePanel)) {
      if (this.pendingSectionDirection !== direction) {
        this.pendingSectionDirection = direction;
        return;
      }
    }

    if (this.isWheelLocked) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(sections.length - 1, activeIndex + direction));

    if (nextIndex === activeIndex) {
      return;
    }

    this.pendingSectionDirection = 0;
    this.isWheelLocked = true;

    this.rotatePlanet(delta * 2);

    container.scrollTo({
      top: sections[nextIndex].offsetTop,
      behavior: 'smooth',
    });

    setTimeout(() => {
      this.isWheelLocked = false;
    }, this.WHEEL_LOCK_MS);
  }

  public onContentScroll(container: HTMLElement): void {
    this.isScrolled = container.scrollTop > this.SCROLL_THRESHOLD;
  }

  public scrollToSection(section: HTMLElement): void {
    const container = document.querySelector<HTMLElement>('.it-scroll-content');

    if (!container) {
      return;
    }

    this.pendingSectionDirection = 0;

    container.scrollTo({
      top: section.offsetTop,
      behavior: 'smooth',
    });
  }

  private rotatePlanet(delta: number): void {
    window.dispatchEvent(
      new CustomEvent('planet-scroll', {
        detail: { delta },
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

  private panelHasScroll(panel: HTMLElement): boolean {
    return panel.scrollHeight > panel.clientHeight + 1;
  }

  private scrollPanelIfPossible(panel: HTMLElement, delta: number): boolean {
    const maxScrollTop = panel.scrollHeight - panel.clientHeight;

    if (maxScrollTop <= 1) {
      return false;
    }

    const isDown = delta > 0;
    const isUp = delta < 0;

    const isAtTop = panel.scrollTop <= 0;
    const isAtBottom = panel.scrollTop >= maxScrollTop - 1;

    if (isDown && !isAtBottom) {
      panel.scrollTop = Math.min(maxScrollTop, panel.scrollTop + Math.abs(delta));
      return true;
    }

    if (isUp && !isAtTop) {
      panel.scrollTop = Math.max(0, panel.scrollTop - Math.abs(delta));
      return true;
    }

    return false;
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
