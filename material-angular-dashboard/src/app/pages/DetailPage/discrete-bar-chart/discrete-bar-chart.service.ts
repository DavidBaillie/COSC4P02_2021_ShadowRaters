import { Injectable } from '@angular/core';

@Injectable()
export class DiscreteBarChartService {
  public getCumulativeReturn() {
    return [
      {
        label: 'Campus Facilities',
        value: 3.7,
      },
      {
        label: 'Learning Recourse & Student Support',
        value: 4.0,
      },
      {
        label: 'Mental care & wellness',
        value: 4.5,
      },
      {
        label: 'Campus Environment',
        value: 3.8,
      },
    ];
  }
}
