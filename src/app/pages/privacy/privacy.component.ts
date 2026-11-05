import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { POLICY_LAST_UPDATED, PRIVACY_SECTIONS } from '../shared/const/legal-info';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyComponent {
  protected readonly sections = PRIVACY_SECTIONS;
  protected readonly lastUpdated = POLICY_LAST_UPDATED;
}
