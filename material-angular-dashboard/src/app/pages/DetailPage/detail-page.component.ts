import {Component, HostBinding, OnInit} from '@angular/core';
import {UpgradableComponent} from 'theme/components/upgradable';
<<<<<<< HEAD:material-angular-dashboard/src/app/pages/DetailPage/detail-professor/detail-professor.component.ts
import {IProfessor} from '../../search/search-professor/professor';
import {ProfReview} from './professorReviews';
=======
import {IProfessor} from '../search/search-professor/professor';
import {Details} from './Reviews';
>>>>>>> web_integration:material-angular-dashboard/src/app/pages/DetailPage/detail-page.component.ts
import {ActivatedRoute} from '@angular/router';
import {SearchService} from "../search/search-general/search.service";


@Component({
  selector: 'app-details',
  templateUrl: './detail-page.html',
  styleUrls: ['./detail-page.component.scss'],
  providers: [SearchService],
})

export class DetailsComponent extends UpgradableComponent implements OnInit {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.ui-components') public readonly uiComponents = true;


  //Attributes for data of professors
  hits: IProfessor[];
  target_hit: IProfessor;
  data: { name: string; rating: string }[];


  //Attributes for data of professor reviews
<<<<<<< HEAD:material-angular-dashboard/src/app/pages/DetailPage/detail-professor/detail-professor.component.ts
  reviews: ProfReview[];
=======
  reviews: Details[];
>>>>>>> web_integration:material-angular-dashboard/src/app/pages/DetailPage/detail-page.component.ts
  data_comments: Array<Object>;

  modal: HTMLElement;
  modalTextArea: HTMLTextAreaElement;

  constructor(private activatedroute: ActivatedRoute, private searchService: SearchService) {
    super();
  }

  target_type: string = this.activatedroute.snapshot.paramMap.get("type");
  target_id: string = this.activatedroute.snapshot.paramMap.get("id");

  private async getAHit() {
    const temp = await this.searchService.getHits(this.target_type);
    this.hits = this.searchService.getRightHits(temp, this.target_type);
    this.target_hit = this.hits.find(x => this.searchService.getRightId(x, this.target_type)  === this.target_id);
    return this.target_hit;
  }

  private async getReviews() {
    const temp = await this.searchService.getReviews(this.target_type, this.target_id);
    this.reviews = temp.reviews;
    return this.reviews;
  }


  ngOnInit() {
    this.getAHit().then(res => {
      this.data = [
        {
          name: res.name,
          rating: '4.8',
        },
      ];
    });

    this.getAProfReviews().then(res => {
      this.data_comments = res;
    });

    // this.data_comments = [
    //   {
    //     userID: 'Mathieu Cote',
    //     comment: 'I think we did a Pretty Good job so far!',
    //     rating: '4.5',
    //   },
    //   {
    //     userID: 'Spongebob',
    //     comment: 'Always follow your heart – unless your heart is bad with directions!',
    //     rating: '5.0',
    //   },
    //   {
    //     userID: 'Squidward',
    //     comment: "It would be if I didn't have to go to work.",
    //     rating: '3.8',
    //   },
    //   {
    //     userID: 'Mathieu Cote',
    //     comment: 'I think we did a Pretty Good job so far!',
    //     rating: '4.5',
    //   },
    //   {
    //     userID: 'Spongebob',
    //     comment: 'Always follow your heart – unless your heart is bad with directions!',
    //     rating: '5.0',
    //   },
    //   {
    //     userID: 'Squidward',
    //     comment: "It would be if I didn't have to go to work.",
    //     rating: '3.8',
    //   },
    // ];

    this.modal = document.getElementById("myModal");
    this.modalTextArea = <HTMLTextAreaElement>document.getElementById("modalTextArea");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
      if (event.target == this.modal) {
        this.modal.style.display = "none";
      }
    }
  }

  public openModal(): void {
    this.modal.style.display = "block";
  }

  public submitRating():void {
    var rating:number = this.getNumericalRating();
    this.data_comments.unshift(
      {
        userID: "Anonymous",
        date: "Jan 10th, 2021",
        comment: this.modalTextArea.value,
        rating,
      }
    );
    this.modalTextArea.value = " ";
    this.modal.style.display = "none";
  }
  
  public getNumericalRating():number {
    var stars:HTMLElement = document.getElementById("star-radios");
    var children:any = stars.children;
    var rating:number = 0;

    // iterate over the stars and get the one checked
    for (var i=0; i < stars.children.length; i++) {
      if (children[i].checked) 
        rating = parseFloat(children[i].id)
    }
        
    return rating;
  }


}
