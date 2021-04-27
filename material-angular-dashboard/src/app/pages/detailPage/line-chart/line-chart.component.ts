import * as d3 from 'd3';
import * as nv from 'nvd3';

import { Component, ElementRef, HostBinding, OnInit, OnChanges, Input } from '@angular/core';

import { LineChartComponent as BaseLineChartComponent } from 'theme/components/line-chart';

import { LineChartService } from './line-chart.service';

@Component({
  selector: 'app-line-chart',
  template: ``,
  providers: [LineChartService],
})
export class LineChartComponent extends BaseLineChartComponent implements OnChanges {
  @Input() data: Object[];
  @Input() name: string;
  colors: string[];
  

  constructor(el: ElementRef, public lineChartService: LineChartService,) {
    super(el);

    this.colors = ['#00bcd4', '#ffc107', '#f44336', 'black', 'yellow', 'white'];

    this.xAxis = 'YEAR';
    this.yAxis = 'AVERAGE RATING';
    this.maxX = 0;

    this.afterConfigure();
  }

  ngOnInit() {}

  ngOnChanges() { 
    this.animatedData = [];
    this.rawData = [];
    var firstYear = Number.POSITIVE_INFINITY;
    var lastYear = 0;
    for(var i=0; i<this.data.length; i++) {

      var years = Object.keys(this.data[i]);
      if (firstYear > parseInt(years[0]))
        firstYear = parseInt(years[0]);

      if (lastYear < parseInt(years[years.length - 1]))
        lastYear = parseInt(years[years.length - 1]);        

      this.maxX = Math.max(this.maxX, (years.length - 1) / 2.0);
      this.animatedData.push(
        {
          values: [],
          key: this.name[i],
          color: this.colors[i],
        }
      );

      var rawD = this.lineChartService.getDataPoints.bind(this.lineChartService);
      rawD = [...rawD(0.5, this.data[i], years)]
      this.rawData.push(rawD);
    } 

    this.year_labels = [];
    for (var y = firstYear; y <= lastYear; y++)
      this.year_labels.push(y);
  
    this.refesh();
  }

}
