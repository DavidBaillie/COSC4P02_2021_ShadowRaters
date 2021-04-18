import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SearchService} from '../../search/search-general/search.service';

@Component({
  selector: 'mini-search',
  styleUrls: ['./mini-search.component.scss'],
  templateUrl: './mini-search.component.html',
  providers: [SearchService],
})
export class MiniSearchComponent implements OnInit {
  @Input() target_type: string;
  @Output() selectIdEvent = new EventEmitter<string>();
  allHits:any[];
  hits:any[];
  modal

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.getHits();

    this.modal = document.getElementById('myModal'); 
    window.onclick = (event) => {
      this.hits = []; // empty suggestions when the user clicks outside of the mini search bar
      if (event.target === this.modal)  // AND when the user clicks anywhere outside of the modal, close it
        this.modal.style.display = 'none';
    };
  }

  emitId(id: string, name: string) {
    this.selectIdEvent.emit(`${id},${name}`);
  }

  private async getHits() {
    const hits = await this.searchService.getHits(this.target_type);
    this.allHits  = this.searchService.getRightHits(hits, this.target_type);
    this.hits = [];
  }

  public filterP() {
    const name:string = (<HTMLInputElement> document.getElementById("mini-search-bar")).value;
    var s1:string;
    var s2:string = name.toLowerCase().replace(/\s/g, "");

    if (s2 == "") {
      this.hits = [];
      return;
    }

    this.hits = this.allHits.filter( (prof:any) => {
      s1 = prof.name.toLowerCase().replace(/\s/g, "");
      return s1.toLowerCase().includes(s2);
    });
  }

}
