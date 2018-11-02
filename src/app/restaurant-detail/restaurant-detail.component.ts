import { Component, OnInit } from '@angular/core';
import { ApiHitService } from '../apiHit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss']
})
export class RestaurantDetailComponent implements OnInit {
  placeDetails: any;

  constructor(private hit: ApiHitService, private router: Router,) { }

  ngOnInit() {
    if (this.hit.sendDetails()) {
      console.log(this.hit.sendDetails())
      this.placeDetails = this.hit.sendDetails();
    }
    else {
      this.router.navigate(['/home'])
    }
  }

}
