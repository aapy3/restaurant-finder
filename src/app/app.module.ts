import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModalModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { routing } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyOwnCustomMaterialModule } from './angularMaterial.module';
import { HomeComponent } from './home/home.component';
import { ApiHitService } from './apiHit.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RestaurantListComponent,
    RestaurantDetailComponent
  ],
  imports: [
    BrowserModule,
    routing,
    MyOwnCustomMaterialModule,
    NgbModule,
    HttpModule,
    NgbModalModule,
    NgbRatingModule
  ],
  providers: [
    ApiHitService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
