import * as d3 from 'd3';
import * as nv from 'nvd3';

import { AfterViewInit, Component, ElementRef, HostBinding } from '@angular/core';
import { max } from 'rxjs/operators';

@Component({
  template: '',
})
export abstract class LineChartComponent implements AfterViewInit {
  protected animatedData;
  protected rawData;
  protected year_labels;
  protected xAxis;
  protected yAxis;
  protected maxX;
  private container;
  private svg;
  private svgHeight;
  private svgWidth;
  private barsLayout;
  private lineChart;
  private timer;
  private columns;
  // protected xStep = 0.125;
  protected xStep = 0.5;
  private xDrawStep = 0.5;
  private margin = 20;
  private durationResizeAnimation = 1;
  private drawStep = this.xStep * this.xDrawStep;
  private animationTime = 400;

  @HostBinding('class.line-chart__container') private readonly lineChartContainer = true;

  constructor(private el: ElementRef) { }

  public ngAfterViewInit() {
    // this.container = d3.select(this.el.nativeElement);
    // if (this.container[0][0]) {
    //   this.drawChart();
    // }
  }


  public refesh() {
    this.container = d3.select(this.el.nativeElement);
    if (this.container[0][0]) {
      this.container[0][0].innerHTML = "";
      this.drawChart();
    }
  }

  protected afterConfigure() {
    this.columns = this.maxX / 2;
  }

  private addSvgContainer() {
    this.svg = this.container.append('div').append('svg');
  }

  private getSvgSizes() {
    const svgWidth = getComputedStyle(this.svg[0][0]).width;
    const svgHeight = getComputedStyle(this.svg[0][0]).height;
    this.svgWidth = +svgWidth.slice(0, -2);
    this.svgHeight = +svgHeight.slice(0, -2) - this.margin;
  }

  private buildBackground() {
    this.addSvgContainer();
    this.getSvgSizes();

    const bars = Array(this.columns).fill(this.svgHeight);

    this.barsLayout = this.svg.append('g')
      .attr('class', 'bars')
      .attr('transform', 'translate(' + this.margin + ', 0)')
      .selectAll('rect')
      .data(bars)
      .enter()
      .append('rect');

    // this.addAxisLabels();

    this.setBackgroundSizes();
  }

  private setBackgroundSizes() {
    const availableBarWidth = (this.svgWidth - 2 * this.margin) / this.columns;
    const barWidth = availableBarWidth / 2;
    this.barsLayout
      .attr('fill', '#4a4a4a')
      .attr('y', this.margin)
      .attr('height', (d, i) => d)
      .transition().duration(this.durationResizeAnimation)
      .attr('width', barWidth)
      .attr('x', (d, i) => i * availableBarWidth);
    this.container.select('svg .x-axis-label')
      .transition().duration(this.durationResizeAnimation)
      .attr('x', this.svgWidth - this.margin - 7 - this.xAxis.length * 7)
      .attr('y', this.svgHeight - (this.svgHeight) / 5 + this.margin + this.maxX);
  }

  private drawChart() {
    this.buildBackground();
    this.buildLegend();
    this.buildNvGraph();
    this.animateGraphs();
  }

  private buildNvGraph() {
    this.tuneNvGraph();

    nv.addGraph(() => {
      this.svg.datum(this.animatedData)
        .transition().duration(0)
        .call(this.lineChart);
      nv.utils.windowResize(this.resizeBackground.bind(this));
      nv.utils.windowResize(this.lineChart.update);
      return this.lineChart;
    });
  }

  private tuneNvGraph() {
    this.lineChart = nv.models.lineChart()
      .margin({ top: this.margin-10, right: this.margin+35, bottom: 40, left: this.margin +40 })
      .useInteractiveGuideline(true)
      .xDomain([0, this.maxX])
      .yDomain([0, 5])
      .showLegend(true)
      .showYAxis(true)
      .showXAxis(true)
      .pointSize(80);

    // this.lineChart.tooltip.enabled(false);
    // this.lineChart.interactiveLayer.tooltip.enabled(false);

    this.lineChart.xAxis
      .axisLabel(this.xAxis)
      .showMaxMin(false)
      .tickValues([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7])
      .tickFormat((d)=>{
        return this.year_labels[d + d];
      });

    this.lineChart.yAxis
    .axisLabel(this.yAxis)
      .showMaxMin(false)
      .ticks(5);
  }

  private buildLegend() {
    const legend = this.container.append('div')
      .attr('class', 'legend')
      .selectAll('.legend__item')
      .data(this.animatedData)
      .enter()
      .append('div')
      .attr('class', 'legend__item');

    legend.append('div')
      .attr('class', 'legend__mark pull-left')
      .style('background-color', d => d.color);

    legend.append('div')
      .attr('class', 'legend__text')
      .text(d => d.key);
  }

  private resizeBackground() {
    this.getSvgSizes();
    this.setBackgroundSizes();
  }

  private animateGraphs() {
    let i = 0;
    this.timer = setInterval(
      () => {
        this.complementGraphs();
        this.drawNextStep(i);
        i += this.xStep;
        this.checkEndOfAnimation(i);
      },
      Math.round(400 / ((this.maxX / this.xStep) / this.xDrawStep)),
    );
  }

  private drawNextStep(i) {
    if (i !== 0 && i % this.drawStep === 0 || i === this.maxX) {
      try {
        this.lineChart.update();
      } catch (e) {
        // FIXME: error when chart out of sight
      }
    }
  }

  private checkEndOfAnimation(i) {
    if (i >= this.maxX + 1) {
      this.lineChart.duration(this.durationResizeAnimation);
      this.animatedData.forEach((item) => {
        item.fillOpacity = 0.11;
      });

      clearInterval(this.timer);
      this.lineChart.update();
    }
  }

  private complementGraphs() {
    this.rawData.forEach((graph, i) => this.animatedData[i].values.push(graph.shift()));
  }
}
