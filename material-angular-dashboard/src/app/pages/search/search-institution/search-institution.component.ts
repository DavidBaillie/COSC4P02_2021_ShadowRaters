import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UpgradableComponent } from 'theme/components/upgradable';
import {SearchService} from '../search-general/search.service';
import {IProfessor} from '../search-general/professor';

@Component({
  selector: 'search-professor',
  styleUrls: ['./search-institution.component.scss'],
  templateUrl: './search-institution.component.html',
  providers: [SearchService],
})
export class SearchInstitution extends UpgradableComponent implements OnInit{
  allHits:IProfessor[];
  hits:IProfessor[];

  constructor(private router: Router, private searchService: SearchService) {
    super();
  }

  ngOnInit() {
    this.getHits();
  }

  private async getHits() {
    const hits = await this.searchService.getHits("university");
    this.hits = hits.university;
    // this.hits = this.searchService.getRightHits(hits, "university");
    this.allHits = this.hits;
  }

  public filterP() {
    const profName:string = (<HTMLInputElement> document.getElementById("school")).value;
    var s1:string;
    var s2:string = profName.toLowerCase().replace(/\s/g, "");

    if (s2 == "") {
      this.hits = this.allHits;
      return;
    }

    this.hits = this.allHits.filter( (prof:any) => {
      s1 = prof.name.toLowerCase().replace(/\s/g, "");
      return s1.toLowerCase().includes(s2);
    });
  }

  public goToHit(uid:string) {
    this.router.navigate(['/app/details/university/'+uid]);
  }

}
