import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';

import { WarningRange } from '../../model/commit-storage';

@Component({
  selector: 'app-toggleable-range-slider',
  templateUrl: './toggleable-range-slider.component.html',
  styleUrls: ['./toggleable-range-slider.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatSliderModule,
    MatTooltipModule,
  ]
})
export class ToggleableRangeSliderComponent {
  @Input() settings!: WarningRange;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;

  @Output() settingsChange: EventEmitter<WarningRange> = new EventEmitter<WarningRange>();

  emitData() {
    this.settingsChange.emit(this.settings);
  }

  syncLowerBound() {
    this.settings.range[0] = this.settings.range[1];
  }
}
