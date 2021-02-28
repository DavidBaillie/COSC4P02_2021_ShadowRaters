import { Injectable } from '@angular/core';

@Injectable()
export class DiscreteBarChartService {
  public getCumulativeReturn() {
    return [
      {
        label: 'Punctuality',
        value: 22,
      },
      {
        label: 'Clarity',
        value: 31,
      },
      {
        label: 'Friendliness',
        value: -5,
      },
      {
        label: 'Passion',
        value: 16,
      },
      {
        label: 'Availability',
        value: 19,
      },
      {
        label: 'Option 6',
        value: 26,
      },
      {
        label: 'Option 7',
        value: 9,
      },
    ];
  }
}
