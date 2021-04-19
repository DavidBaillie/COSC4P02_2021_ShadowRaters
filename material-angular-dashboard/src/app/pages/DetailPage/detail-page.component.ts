import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UpgradableComponent} from 'theme/components/upgradable';
import {SearchService} from '../search/search-general/search.service';
import {IItem} from '../search/search-professor/professor';
import {IDetail, IMyComment} from "./Reviews";
import {AuthService} from '@services/*';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-details',
  templateUrl: './detail-page.html',
  styleUrls: ['./detail-page.component.scss'],
  providers: [SearchService],
})

export class DetailsComponent extends UpgradableComponent implements OnInit {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.ui-components') public readonly uiComponents = true;


  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService, private authService: AuthService, private httpClient: HttpClient) {
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

  //Show user the thumb up/down that they have voted for
  voteStatus: any;




  // Get the name of an object by id
  private async getAHit() {
    const temp = await this.searchService.getHits(this.target_type);
    this.hits = this.searchService.getRightHits(temp, this.target_type);
    this.target_hit = this.hits.find(x => this.searchService.getRightId(x, this.target_type) === this.target_id);
    return this.target_hit;
  }

  private async getReviews() {
    let reviews: IDetail[];
    const temp = await this.searchService.getReviews(this.target_type, this.target_id);
    reviews = temp.reviews;
    return reviews;
  }

  //return the correct rid
  public getItemRid(item: any) {
    switch (this.target_type) {
      case 'professor':
        return item.rpid;
      case 'university':
        return item.ruid;
      case 'department':
        return item.rdid;
      case 'course':
        return item.rcid;
    }
  }



  //Get vote information for the current user
  private showUserThumbStatus() {
    if (localStorage.getItem('uuid')) {
      this.authService.getVotes(this.target_type).subscribe(
        res => {
          for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < this.data_comments.length; j++) {
              if (this.getItemRid(res[i]) == this.getItemRid(this.data_comments[j])) {
                this.data_comments[j].flag = res[i].flag;
                // console.log(res[i].flag);
              }
            }
          }
        }
      );

    }
  }

  private getAverageScore(): number {
    let temp: number = 0;
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
    }).then(() =>
      this.showUserThumbStatus()
    );

    //Initializing comment box
    this.modal = document.getElementById('myModal');
    this.modalTextArea = document.getElementById('modalTextArea') as HTMLTextAreaElement;
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.modal.style.display = 'none';
      }
    };
  }

  //Display data sort by given attribute
  public sortBy(prop: string) {
    return this.data_comments.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  public openModal(): void {
    this.modal.style.display = 'block';
  }

  //validating rating
  public checkRating(rating): boolean {
    return (rating >= 0 && rating <= 5);
  }

  //validating comment
  public checkComment(comment) {
    return (comment.length > 10 && comment.length < 500);
  }

  //Check if the comment is proper before submission
  public submitRating(): void {
    const rating: number = this.getNumericalRating();
    const token = localStorage.getItem("token");
    const comment = this.modalTextArea.value;

    if (!this.checkRating(rating)) {
      alert("Invalid rating! Please choose a score between 0 to 5!");
    } else if (!this.checkComment(comment)) {
      alert("Comment must be between 10 to 500 words!");
    } else {
      this.data_myComment = {
        score: rating,
        comment: comment,
        token: token
      };

      //Comment submission
      this.authService.postComment(this.target_type, this.target_id, this.data_myComment).subscribe(
        res => {
          if (res.msg == 'success') {
            alert("Comment posted successfully!");
            window.location.reload();
          } else {
            alert(res.msg);
          }
        }
      );

      this.modalTextArea.value = ' ';
      this.modal.style.display = 'none';
    }
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


  //Function post a positive vote for a comment as a logged in user.
  public thumbUp(item: IDetail) {
    if (localStorage.getItem('uuid') == undefined) {
      alert("Voting requires login!");
    } else {
      let rid: string;
      switch (this.target_type) {
        case 'professor':
          rid = item.rpid;
          break;
        case 'university':
          rid = item.ruid;
          break;
        case 'department':
          rid = item.rdid;
          break;
        case 'course':
          rid = item.rcid;
      }
      this.authService.cancelThumb(this.target_type, rid).then(() =>
        this.authService.thumbUp(this.target_type, rid).subscribe(
          res => {
            if (res.msg == 'success') {
              alert("Vote is successfully!");
              window.location.reload();
            } else alert(res.msg);
          }
        )
      ).catch(error => console.log(error));
    }
  }


  //Function post a negative vote for a comment as a logged in user.
  public thumbDown(item: IDetail) {
    if (localStorage.getItem('uuid') == undefined) {
      alert("Voting requires login!");
    } else {
      let rid: string;
      switch (this.target_type) {
        case 'professor':
          rid = item.rpid;
          break;
        case 'university':
          rid = item.ruid;
          break;
        case 'department':
          rid = item.rdid;
          break;
        case 'course':
          rid = item.rcid;
      }
      this.authService.cancelThumb(this.target_type, rid).then(() =>
        this.authService.thumbDown(this.target_type, rid).subscribe(
          res => {
            if (res.msg == 'success') {
              alert("Vote is successfully!");
              window.location.reload();
            } else alert(res.msg);
          }
        )
      ).catch(error => console.log(error));
    }
  }


}
