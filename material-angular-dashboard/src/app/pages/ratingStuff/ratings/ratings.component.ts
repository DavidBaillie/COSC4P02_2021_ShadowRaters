import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {
  @Input() data;

  constructor() { }

  ngOnInit(): void {
  }

}
