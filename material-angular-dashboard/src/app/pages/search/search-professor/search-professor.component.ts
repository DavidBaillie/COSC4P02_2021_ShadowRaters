import { Component} from '@angular/core';

@Component({
  selector: 'search-professors',
  styleUrls: [],
  template: '<search [target_type]="type"></search>',
})
export class SearchProfessor {
  type:string = "professor"
  constructor() {}
}
