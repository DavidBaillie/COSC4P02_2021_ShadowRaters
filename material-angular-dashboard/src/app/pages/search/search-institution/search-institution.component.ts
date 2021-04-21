import { Component} from '@angular/core';

@Component({
  selector: 'search-department',
  styleUrls: [],
  template: '<search [target_type]="type"></search>',
})
export class SearchInstitution {
  type:string = "university"
  constructor() {}
}
