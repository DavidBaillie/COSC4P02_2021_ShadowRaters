import { Component, OnInit } from '@angular/core';

import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'professor',
  styleUrls: ['../../departments/departments.component.scss', '../../../../theme/scss/centre.scss'],
  templateUrl: './professor.component.html',
})
export class ProfessorComponent extends UpgradableComponent implements OnInit {
  ratings:Array<Object>;
  modal:HTMLElement;
  modalTextArea:HTMLTextAreaElement;

  ngOnInit() {
    this.ratings = [
      {
        date: 'Jan 10th, 2021',
        comment: `Lectures cover the material well. So many things well done that it is hard to state all of them. 
                  The fact that she created an 
                  online class that maintained the quality of offline classes is a big "WOW!" factor.`
      },
      {
        date: 'Jun 25th, 2019',
        comment: `Good lecturer, but you can't skip either class or readings. 
                  Entertaining if you are interested in the course material.`
      },
      {
        date: 'Nov 7th, 2018',
        comment: `Confusing lectures as he likes to combine lectures and teach half of one lecture and half of another. 
                  Usually lets us leave early though. A lot of reading to do to be able to understand the lectures.
                  Lectures can get kind of all over the place and confusing. 
                  But he seems like a good guy who really is inspired by psychology and loves his work`
      },
      {
        date: 'Nov 7th, 2018',
        comment: `Sucks butt`
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
    this.ratings.unshift(
      {
        date: "Jan 10th, 2021",
        comment: this.modalTextArea.value,
      }
    );
    this.modalTextArea.value = " ";
    this.modal.style.display = "none";
  }

}
