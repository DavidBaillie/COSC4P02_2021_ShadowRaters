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
  
  hits: IItem[]; //Data of the item to be reviewed (a prof/course/department/university)
  target_hit: IItem;
  target_name: string[];
  name: string;
  avg_score: any[]; //Average score
  avg_year_scores: any[]; //Average score per year
  modal: HTMLElement;
  modalTextArea: HTMLTextAreaElement;
  data_comments: IDetail[]; //Data of comments GET from API
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
          score: this.getAverageScore(this.data_comments),
        }
      ];
    });
   
    this.modal = document.getElementById('myModal');
    this.modalTextArea = document.getElementById('modalTextArea') as HTMLTextAreaElement;

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.modal.style.display = 'none';
      }
    };

  }

  // Get the name of an object by id
  private async getAHit() {
    const temp = await this.searchService.getHits(this.target_type);
    this.hits = this.searchService.getRightHits(temp, this.target_type);
    this.target_hit = this.hits.find(x => this.searchService.getRightId(x, this.target_type) === this.target_id);
    return this.target_hit;
  }

  private async getReviews(target_type, target_id){
    let reviews: IDetail[];
    const temp = await this.searchService.getReviews(target_type, target_id);
    reviews = temp.reviews;
    return reviews;
  }

  private getAverageScore(data_comments):number {
    let temp:number = 0;
    for (let i = 0; i < data_comments.length; i++) {
      temp += data_comments[i].score;
    }

    var avg = temp / data_comments.length;
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

  public openModal(): void {
    this.modal.style.display = 'block';
  }

  //validating rating
  public checkRating(rating):boolean {
      return (rating>=0 && rating <=5);
  }

  //validating comment
  public checkComment(comment){
    return (comment.length > 10 && comment.length < 500);
  }

  //Check if the comment is proper before submission
  public submitRating(): void {
    const rating: number = this.getNumericalRating();
    const token = localStorage.getItem("token");
    const comment = this.modalTextArea.value;

    if(!this.checkRating(rating)){
      alert("Invalid rating! Please choose a score between 0 to 5!");
    }else if(!this.checkComment(comment)){
      alert("Comment must be between 10 to 500 words!");
    }else{
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

  public getAvgYearScores(data_comments) {
    var yearRatings = {};
    var numYearRatings = {};
    for (var i = 0; i < data_comments.length; i++) {
      var comment:any = data_comments[i];
      var year:string = comment.date.split(" ")[3];
      var score:number = comment.score;

      if (year in yearRatings) {
        yearRatings[year] += score; 
        numYearRatings[year] += 1;
      }
      else {
        yearRatings[year] = score;
        numYearRatings[year] = 1;
      }
    }

    for (var key in yearRatings) {
      yearRatings[key] /= numYearRatings[key];
    }

    return yearRatings;
  }

}
