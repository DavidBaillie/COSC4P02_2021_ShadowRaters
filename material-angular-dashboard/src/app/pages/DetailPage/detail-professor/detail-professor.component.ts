import {Component, HostBinding, OnInit} from '@angular/core';
import {UpgradableComponent} from 'theme/components/upgradable';
import {IProfessor} from '../../search/search-professor/professor';
import {ProfReview} from './professorReviews';
import {ActivatedRoute} from '@angular/router';
import {SearchProfessorService} from "./detail-professor.service";


@Component({
  selector: 'app-professorDetails',
  templateUrl: './detail-professor.html',
  styleUrls: ['./detail-professor.component.scss'],
  providers: [SearchProfessorService],
})

export class DetailProfessorComponent extends UpgradableComponent implements OnInit {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.ui-components') public readonly uiComponents = true;


  //Attributes for data of professors
  professors: IProfessor[];
  target_professor: IProfessor;
  data: { name: string; rating: string }[];


  //Attributes for data of professor reviews
  reviews: ProfReview[];
  data_comments: Array<Object>;

  modal: HTMLElement;
  modalTextArea: HTMLTextAreaElement;

  constructor(private _Activatedroute: ActivatedRoute, private searchProfessorService: SearchProfessorService) {
    super();
  }

  target_pid: string = this._Activatedroute.snapshot.paramMap.get("pid");

  private async getAProfessor() {
    const temp = await this.searchProfessorService.getProfessors();
    this.professors = temp.professor;
    this.target_professor = this.professors.find(x => x.pid === this.target_pid);
    return this.target_professor;
  }

  private async getAProfReviews() {
    const temp = await this.searchProfessorService.getProfReviews(this.target_pid);
    this.reviews = temp.reviews;
    return this.reviews;
  }


  ngOnInit() {
    this.getAProfessor().then(res => {
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

  public submitRating(): void {
    this.data_comments.unshift(
      {
        date: "Jan 10th, 2021",
        comment: this.modalTextArea.value,
      }
    );
    this.modalTextArea.value = " ";
    this.modal.style.display = "none";
  }


}
