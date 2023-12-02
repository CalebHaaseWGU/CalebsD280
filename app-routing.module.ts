import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SvgMapComponent } from './svg-map.component'; // Update this path to where your SvgMapComponent is located

// Define the routes for the application
const routes: Routes = [
  { path: '', component: SvgMapComponent } // Set the MapComponent as the default route component
  // Add other routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

