import { Component} from '@angular/core';

@Component({
  selector: 'search-department',
  styleUrls: [],
  template: '<search [target_type]="type"></search>',
})
export class SearchDepartment {
  type:string = "department"
  constructor() {}
}
