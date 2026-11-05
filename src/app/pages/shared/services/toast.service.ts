import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  readonly id: string;
  readonly type: ToastType;
  readonly title?: string;
  readonly message: string;
  readonly durationMs: number;
}

export interface ToastOptions {
  readonly title?: string;
  readonly durationMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private static readonly DEFAULT_DURATION_MS = 3500;
  private static readonly MAX_VISIBLE = 5;

  private readonly _toasts = signal<readonly Toast[]>([]);
  public readonly toasts = this._toasts.asReadonly();

  public success(message: string, options?: ToastOptions): void {
    this.push('success', message, options);
  }

  public error(message: string, options?: ToastOptions): void {
    this.push('error', message, options);
  }

  public info(message: string, options?: ToastOptions): void {
    this.push('info', message, options);
  }

  public remove(id: string): void {
    this._toasts.update((list) => list.filter((toast) => toast.id !== id));
  }

  private push(type: ToastType, message: string, options: ToastOptions = {}): void {
    const toast: Toast = {
      id: crypto.randomUUID(),
      type,
      title: options.title,
      message,
      durationMs: options.durationMs ?? ToastService.DEFAULT_DURATION_MS,
    };

    this._toasts.update((list) => [toast, ...list].slice(0, ToastService.MAX_VISIBLE));

    window.setTimeout(() => this.remove(toast.id), toast.durationMs);
  }
}
