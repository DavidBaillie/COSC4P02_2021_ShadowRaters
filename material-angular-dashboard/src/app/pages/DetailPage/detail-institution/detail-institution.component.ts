import { Component, HostBinding, OnInit } from '@angular/core';
import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'app-institutionDetails',
  templateUrl: './detail-institution.html',
  styleUrls: ['./detail-institution.component.scss'],
})
export class DetailInstitutionComponent extends UpgradableComponent implements OnInit {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.ui-components') public readonly uiComponents = true;

  data_comments:Array<Object>;
  modal:HTMLElement;
  modalTextArea:HTMLTextAreaElement;

  public data = [
    {
      name: 'Brock University',
      rating: '4.8',
    },
  ];

  ngOnInit() {
    this.data_comments = [
      {
        userID:'Mathieu Cote',
        comment:'I think we did a Pretty Good job so far!',
        rating:'4.5',
      },
      {
        userID:'Spongebob',
        comment:'Always follow your heart – unless your heart is bad with directions!',
        rating:'5.0',
      },
      {
        userID:'Squidward',
        comment:"It would be if I didn't have to go to work.",
        rating:'3.8',
      },
      {
        userID:'Mathieu Cote',
        comment:'I think we did a Pretty Good job so far!',
        rating:'4.5',
      },
      {
        userID:'Spongebob',
        comment:'Always follow your heart – unless your heart is bad with directions!',
        rating:'5.0',
      },
      {
        userID:'Squidward',
        comment:"It would be if I didn't have to go to work.",
        rating:'3.8',
      },
    ];

    this.modal = document.getElementById("myModal");
    this.modalTextArea = <HTMLTextAreaElement> document.getElementById("modalTextArea");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
      if (event.target == this.modal) {
        this.modal.style.display = "none";
      }
    }
  }

  public openModal():void {
    this.modal.style.display = "block";
  }

  public submitRating():void {
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
