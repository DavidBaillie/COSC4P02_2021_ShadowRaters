import { Component} from '@angular/core';

@Component({
  selector: 'search-courses',
  styleUrls: [],
  template: '<search [target_type]="type"></search>',
})
export class SearchCourse {
  type:string = "course"
  constructor() {}
}
