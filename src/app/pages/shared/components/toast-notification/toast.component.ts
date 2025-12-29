import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastContainerComponent {
  readonly toast = inject(ToastService);

  trackById = (_: number, t: { id: string }) => t.id;
  close(id: string) {
    this.toast.remove(id);
  }
}
