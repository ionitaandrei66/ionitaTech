import {Component, HostListener, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import emailjs, {EmailJSResponseStatus} from '@emailjs/browser';
import {EMAILJS_CONFIG} from "../shared/const/email-js";

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
  public isScrolled = false;
  public emailUsGroup!: FormGroup;
  private readonly SCROLL_THRESHOLD = 10;

  constructor(private _fb: FormBuilder) {}

  public ngOnInit() {
    this.emailUsGroup = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    this.isScrolled = window.scrollY > this.SCROLL_THRESHOLD;
  }

  public sendEmail() {
   emailjs.send(  EMAILJS_CONFIG.serviceId,
     EMAILJS_CONFIG.templateId, {
     name: this.emailUsGroup.controls['name'].value,
     email: this.emailUsGroup.controls['email'].value,
     message: this.emailUsGroup.controls['message'].value
   }, {
     publicKey: EMAILJS_CONFIG.publicKey,
   }).then((status: EmailJSResponseStatus) =>
   console.log(status)
   )
  }
}
//todo notification for succed plus make it on the instland the modal for request
// + disable and make error for form input
