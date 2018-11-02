import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';


export const routes: Routes = [
  {
    path: '',
    
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'restaurants', component: RestaurantListComponent },
      { path: 'restaurant-details', component: RestaurantDetailComponent }
    ]
  }
]
export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });

