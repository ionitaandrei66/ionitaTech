import {Component, HostListener, OnInit } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import emailjs from '@emailjs/browser';
import {EMAILJS_CONFIG} from "../shared/const/email-js";
import {ToastService} from "../shared/services/toast.service";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  public isScrolled: boolean = false;
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

  public ngOnInit() {
    this.emailUsGroup = this._fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required]],
      message: [null, [Validators.required]],
    });
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    this.isScrolled = window.scrollY > this.SCROLL_THRESHOLD;
  }

  public scrollToContact(section: HTMLElement) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  public sendEmail() {
   emailjs.send(EMAILJS_CONFIG.serviceId,
     EMAILJS_CONFIG.templateId, {
     name: this.emailUsGroup.controls['name'].value,
     email: this.emailUsGroup.controls['email'].value,
     message: this.emailUsGroup.controls['message'].value
   }, {
     publicKey: EMAILJS_CONFIG.publicKey,
   }) .then(() => {
     this.toast.success('Message sent successfully!', { title: 'Success' });
     this.emailUsGroup.reset();
   })
     .catch(() => {
       this.toast.error('Something went wrong. Please try again.', { title: 'Error' });
     });
  }
}

