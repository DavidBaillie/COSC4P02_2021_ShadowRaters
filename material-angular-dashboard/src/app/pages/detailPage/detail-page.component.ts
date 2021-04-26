import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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


  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService, private authService: AuthService, private router: Router) {
    super();
  }

  //Parameters retrieved from search page
  target_type: string = this.activatedRoute.snapshot.paramMap.get('type');
  target_id: string = this.activatedRoute.snapshot.paramMap.get('id');

  hits: IItem[]; //Data of the item to be reviewed (a prof/course/department/university)
  target_hit: IItem;
  target_name: string[];
  name: string;
  avg_score: any[]; //Average score
  avg_year_scores: any[]; //Average score per year
  modal: HTMLElement;
  modalTextArea: HTMLTextAreaElement;
  data_comments: IDetail[] = []; //Data of comments GET from API
  data_myComment: IMyComment; //Data of comment to be posted


  ngOnInit() {
    //Get page item's name
    this.getAHit().then((res) => {
      this.target_name = [res.name];
      this.name = res.name;
    });

    this.getReviews(this.target_type, this.target_id).then((res) => {
      this.data_comments = res;
      this.avg_year_scores = [this.getAvgYearScores(this.data_comments)];
      this.avg_score = [
        {
          score: this.getAverageScore(),
        }
      ];
    }).then(() =>
      this.showUserThumbStatus()
    );

    this.modal = document.getElementById('myModal');
    this.modalTextArea = document.getElementById('modalTextArea') as HTMLTextAreaElement;
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.modal.style.display = 'none';
      }
    }
  }

  // Get the name of an object by id
  private async getAHit() {
    const temp = await this.searchService.getHits(this.target_type);
    this.hits = this.searchService.getRightHits(temp, this.target_type);
    this.target_hit = this.hits.find(x => this.searchService.getRightId(x, this.target_type) === this.target_id);
    return this.target_hit;
  }

  private async getReviews(target_type, target_id) {
    let reviews: IDetail[];
    const temp = await this.searchService.getReviews(target_type, target_id);
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
    var avg = temp / this.data_comments.length;
    avg = Math.round(avg * 10) / 10;
    return avg;
  }

  // get another target to compare it to the current ones in the line graph
  public async addTargetComparison(comparison: string) {
    var avg_years_copy = JSON.parse(JSON.stringify(this.avg_year_scores));
    var t_name_copy = JSON.parse(JSON.stringify(this.target_name));

    let reviews: any;
    var comparison_parts = comparison.split(",");
    var target_id = comparison_parts[0]; //id
    const temp = await this.searchService.getReviews(this.target_type, target_id);
    reviews = temp.reviews;

    avg_years_copy.push(this.getAvgYearScores(reviews));
    t_name_copy.push(comparison_parts[1]);

    // needed to change assign a new value to these
    // to trigger a ngOnChange from the line graphs
    this.avg_year_scores = avg_years_copy;
    this.target_name = t_name_copy;

  }

  //Display data sort by given attribute
  public sortBy(prop: string) {
    return this.data_comments.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  public openModal(): void {
    if(localStorage.getItem("username")){
      this.modal.style.display = 'block';
    }else {
      alert("Login is required!");
      this.goToLogin();
    }
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
            // alert("Comment posted successfully!");
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

  // get the rating from the star input by getting the star checked
  public getNumericalRating(): number {
    const stars: HTMLElement = document.getElementById('star-radios');
    const children: any = stars.children;
    let rating = 0;
    for (let i = 0; i < stars.children.length; i++) {
      if (children[i].checked) {
        rating = parseFloat(children[i].id);
      }
    }
    return rating;
  }

  //Data for graphs
  public getAvgYearScores(data_comments) {
    var yearRatings = {};
    var numYearRatings = {};
    for (var i = 0; i < data_comments.length; i++) {
      var comment: any = data_comments[i];
      var year: string = comment.date.split(" ")[3];
      var score: number = comment.score;

      if (year in yearRatings) {
        yearRatings[year] += score;
        numYearRatings[year] += 1;
      } else {
        yearRatings[year] = score;
        numYearRatings[year] = 1;
      }
    }
    for (var key in yearRatings) {
      yearRatings[key] /= numYearRatings[key];
    }
    return yearRatings;
  }

  //Function post a positive vote for a comment as a logged in user.
  public thumb(thumb_flag: number, item: IDetail) {
    console.log(item.flag);
    if (localStorage.getItem('uuid') == undefined) {
      alert("Voting requires login!");
      this.goToLogin();
    } else if (item.flag == undefined || item.flag != thumb_flag) {
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
        this.authService.thumb(thumb_flag, this.target_type, rid).subscribe(
          res => {
            if (res.msg == 'success') {
              // alert("Vote is successfully!");
              // this.reloadThumbs(item);
              document.location.reload();
            } else alert(res.msg);
          }
        )
      ).catch(error => console.log(error));
    }
  }

  public goToLogin(){
    this.router.navigate(['/pages/login']);
  }

  // public reloadThumbs(item:IDetail){
  //   for (let i = 0; i < this.data_comments.length; i++) {
  //       if (this.data_comments[i].username == item.username){
  //         (item.flag==0)?(this.data_comments[i].flag = 1):(this.data_comments[i].flag = 0);
  //       }
  //   }
  //   let container = document.getElementById("comment_div");
  //   let temp = container.innerText;
  //   container.innerText = "";
  //   container.append(temp);
  //   console.log("Refreshed");
  //
  // }


}
