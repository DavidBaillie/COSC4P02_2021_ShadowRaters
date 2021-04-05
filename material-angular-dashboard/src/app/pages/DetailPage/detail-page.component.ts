import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UpgradableComponent} from 'theme/components/upgradable';
import {SearchService} from '../search/search-general/search.service';
import {IItem} from '../search/search-professor/professor';
import {IDetail, IMyComment} from "./Reviews";
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-details',
  templateUrl: './detail-page.html',
  styleUrls: ['./detail-page.component.scss'],
  providers: [SearchService],
})

export class DetailsComponent extends UpgradableComponent implements OnInit {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.ui-components') public readonly uiComponents = true;


  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService, private authService:AuthService) {
    super();
  }

  //Parameters retrieved from search page
  target_type: string = this.activatedRoute.snapshot.paramMap.get('type');
  target_id: string = this.activatedRoute.snapshot.paramMap.get('id');

  //Data of the item to be reviewed (a prof/course/department/university)
  hits: IItem[];
  target_hit: IItem;
  data: any[];

  //Average score
  avg_score: any[];

  modal: HTMLElement;
  modalTextArea: HTMLTextAreaElement;

  //Data of comments GET from API
  data_comments: IDetail[];

  //Data of comment to be posted
  data_myComment: IMyComment;
  idType: string = "";


  // Get the name of an object by id
  private async getAHit() {
    const temp = await this.searchService.getHits(this.target_type);
    this.hits = this.searchService.getRightHits(temp, this.target_type);
    this.target_hit = this.hits.find(x => this.searchService.getRightId(x, this.target_type) === this.target_id);
    return this.target_hit;
  }

  private async getReviews(){
    let reviews: IDetail[];
    const temp = await this.searchService.getReviews(this.target_type, this.target_id);
    reviews = temp.reviews;
    return reviews;
  }

  private getAverageScore():number {
    let temp:number = 0;
    for (let i = 0; i < this.data_comments.length; i++) {
      temp += this.data_comments[i].score;
    }
    return (temp / this.data_comments.length);
  }


  ngOnInit() {

    //Get page item's name
    this.getAHit().then((res) => {
      this.data = [
        {
          name: res.name,
        },
      ];
    });

    this.getReviews().then((res) => {
      this.data_comments = res;
      this.avg_score = [
        {
          score: this.getAverageScore(),
        }
      ];
    });

    //Get the proper attribute name for id
    switch (this.target_type) {
      case 'professor':
        this.idType = "pid";
        break;
      case 'university':
        this.idType = "uid";
        break;
      case 'department':
        this.idType = "did";
        break;
      case 'course':
        this.idType = "cid";
    }

    this.modal = document.getElementById('myModal');
    this.modalTextArea = document.getElementById('modalTextArea') as HTMLTextAreaElement;

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.modal.style.display = 'none';
      }
    };
  }

  public openModal(): void {
    this.modal.style.display = 'block';
  }

  public submitRating(): void {
    const rating: number = this.getNumericalRating();
    const uuid = localStorage.getItem("uuid");
    const comment = this.modalTextArea.value;
    console.log(rating + " " + uuid + " " + comment);

    this.data_myComment = {
      uuid: uuid,
      score: rating,
      comment: comment,
    };

    //Comment submission
    this.authService.postComment(this.target_type,this.target_id,this.data_myComment).subscribe(
      res => {
        // console.log("testing rating message: " + res.msg);
        if (res.msg == 'success') alert("Comment is successful!");
        else alert(res.msg);
      }
    );


    this.modalTextArea.value = ' ';
    this.modal.style.display = 'none';
  }

  public getNumericalRating(): number {
    const stars: HTMLElement = document.getElementById('star-radios');
    const children: any = stars.children;
    let rating = 0;

    // iterate over the stars and get the one checked
    for (let i = 0; i < stars.children.length; i++) {
      if (children[i].checked) {
        rating = parseFloat(children[i].id);
      }
    }
    return rating;
  }

}
