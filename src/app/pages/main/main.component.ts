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
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    SceneComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  private requestNumber = 5;
  private lastScrollTop = 0;
  private isWheelLocked = false;

  public isScrolled = false;
  public emailUsGroup!: FormGroup;

  private readonly SCROLL_THRESHOLD = 10;

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

    if (this.isWheelLocked) {
      return;
    }

    this.isWheelLocked = true;

    const sections = Array.from(container.querySelectorAll<HTMLElement>('.it-section'));
    const currentIndex = Math.round(container.scrollTop / window.innerHeight);
    const direction = event.deltaY > 0 ? 1 : -1;

    const nextIndex = Math.max(
      0,
      Math.min(sections.length - 1, currentIndex + direction),
    );

    window.dispatchEvent(
      new CustomEvent('planet-scroll', {
        detail: { delta: event.deltaY },
      }),
    );

    sections[nextIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setTimeout(() => {
      this.isWheelLocked = false;
    }, 850);
  }

  public onContentScroll(container: HTMLElement): void {
    const currentScrollTop = container.scrollTop;
    const delta = currentScrollTop - this.lastScrollTop;

    this.isScrolled = currentScrollTop > this.SCROLL_THRESHOLD;

    window.dispatchEvent(
      new CustomEvent('planet-scroll', {
        detail: { delta },
      }),
    );

    this.lastScrollTop = currentScrollTop;
  }

  public scrollToSection(section: HTMLElement): void {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
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
