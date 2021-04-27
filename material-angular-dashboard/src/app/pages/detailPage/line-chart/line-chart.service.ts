import { Injectable } from '@angular/core';

@Injectable()
export class LineChartService {

  public *getDataPoints(step, data, years) {
    var x = 0;
    for (var i = 0; i<years.length+1; i++) {
      var avg = data[years[i]];
      avg = Math.round(avg * 10) / 10;
      yield({x, y: avg});
      x+=step;
    }
  }

}
