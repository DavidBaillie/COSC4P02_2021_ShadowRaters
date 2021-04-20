import { Router } from '@angular/router';
import { SearchService } from '../search/search-general/search.service';
import {Injectable} from '@angular/core';

@Injectable()
export class HomePageService {
    target_types:string[] = ['professor', 'university', 'department', 'course'];

    constructor(private router: Router, private searchService: SearchService) {
    }

    public getRandomHit() {
        var target_type = this.target_types[Math.floor(Math.random() * this.target_types.length)];
        this.getHits(target_type);
    }

    private async getHits(target_type: string) {
        const hits = await this.searchService.getHits(target_type);
        var right_hits = this.searchService.getRightHits(hits, target_type);
        var rand_hit = right_hits[Math.floor(Math.random() * right_hits.length)];
        var rand_id = this.searchService.getRightId(rand_hit, target_type);
        this.goToHit(rand_id, target_type);
    }

    public goToHit(id:string, target_type:string) {
        const itemURL:string = `/app/details/${target_type}/${id}`;
        this.router.navigate([itemURL]);
      }
}



