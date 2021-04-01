import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'team-member',
  styleUrls: ['./team-member.component.scss'],
  templateUrl: './team-member.component.html',
})
export class TeamMemberComponent implements OnInit {
  @Input() memberName: string;

  ngOnInit() {}

}
