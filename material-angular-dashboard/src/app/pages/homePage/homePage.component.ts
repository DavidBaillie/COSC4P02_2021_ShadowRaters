import {Component, HostBinding, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UpgradableComponent} from 'theme/components/upgradable';
import {HomePageService} from './homePage.comonent.service';

@Component({
  selector: 'app-homePage',
  styleUrls: ['./homePage.component.scss'],
  templateUrl: './homePage.component.html',
  providers: [HomePageService]
})

export class HomePageComponent extends UpgradableComponent implements OnInit{
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.mdl-grid--no-spacing') public readonly mdlGridNoSpacing = true;
  interval:any;

  constructor(private router: Router, private homeService: HomePageService) {
    super();
  }

  ngOnInit() {
  }

  public changeEmojis() {
    var emojis = ['👨‍🏫', '🎓', '🏫', '🔬', '📚', '📋', '👩‍🏫', '👩🏽‍🏫', '✏️'];
    var mystery_emoji = document.getElementById("mystery-emoji");
    var emoji = emojis[Math.floor(Math.random() * emojis.length)];
    mystery_emoji.innerHTML = emoji;  
  }

  public setEmojiInterval() {
    if (!this.interval)
      this.interval = setInterval( this.changeEmojis, 200);
  }

  public clearEmojiInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }


  public getRandomHit() {
    this.clearEmojiInterval();
    this.homeService.getRandomHit();
  }

  route_search_prof = function () {
    this.router.navigateByUrl('/app/search/professors');
  };

  route_search_institution = function () {
    this.router.navigateByUrl('/app/search/institutions');
  };

  route_search_course = function () {
    this.router.navigateByUrl('/app/search/courses');
  };

  route_search_department = function () {
    this.router.navigateByUrl('/app/search/departments');
  };

}

