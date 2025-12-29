import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  durationMs: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  public readonly toasts = this._toasts.asReadonly();

  success(message: string, opts?: { title?: string; durationMs?: number }) {
    this.push({ type: 'success', message, ...opts });
  }

  error(message: string, opts?: { title?: string; durationMs?: number }) {
    this.push({ type: 'error', message, ...opts });
  }

  info(message: string, opts?: { title?: string; durationMs?: number }) {
    this.push({ type: 'info', message, ...opts });
  }

  remove(id: string) {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private push(input: { type: ToastType; message: string; title?: string; durationMs?: number }) {
    const toast: Toast = {
      id: crypto?.randomUUID?.() ?? String(Date.now() + Math.random()),
      type: input.type,
      title: input.title,
      message: input.message,
      durationMs: input.durationMs ?? 2500,
    };

    this._toasts.update((list) => [toast, ...list].slice(0, 5));

    window.setTimeout(() => this.remove(toast.id), toast.durationMs);
  }
}
