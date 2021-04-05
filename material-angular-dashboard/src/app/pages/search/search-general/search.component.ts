import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import {SearchService} from './search.service';
import {ActivatedRoute} from '@angular/router';
import {IProfessor} from './professor';


@Component({
  selector: 'search',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html',
  providers: [SearchService],
})

export class Search extends UpgradableComponent implements OnInit{
  allHits:IProfessor[];
  hits:IProfessor[];
  @Input() target_type: string;

  constructor(private activatedroute: ActivatedRoute, private router: Router, private searchService: SearchService) {
    super();
  }

  ngOnInit() {
    this.getHits();
  }

  private async getHits() {
    const hits = await this.searchService.getHits(this.target_type);
    this.hits = this.searchService.getRightHits(hits, this.target_type);
    this.allHits = this.hits;
  }

  public filterP() {
    const profName:string = (<HTMLInputElement> document.getElementById("search-bar")).value;
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

  public goToHit(id:string) {
    const itemURL:string = `/app/details/${this.target_type}/${id}`;
    console.log(itemURL);
    this.router.navigate([itemURL]);
  }

}
