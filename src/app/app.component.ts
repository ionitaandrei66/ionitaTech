import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {ToastContainerComponent} from "./pages/shared/components/toast-notification/toast.component";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private meta: Meta, private titleService: Title) { }

  public ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    const baseUrl = 'https://ionitatech.com';

    const title = 'Ionita Tech | Modern Software Services';
    const description =
      'Ionita Tech delivers scalable, secure, and modern software solutions — from consulting and custom development to cloud and cybersecurity.';

    const ogImage = `${baseUrl}/background.png`;

    this.titleService.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'Ionita Tech, software services, software development, IT consulting, cloud computing, cybersecurity, web applications',
    });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Ionita Tech' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: baseUrl });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: 'Ionita Tech — Shaping the Future of Digital Solutions',
    });
  }
}

