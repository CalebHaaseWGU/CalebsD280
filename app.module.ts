import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Make sure HttpClientModule is imported
import { AppRoutingModule } from './app-routing.module'; // Import AppRoutingModule

import { AppComponent } from './app.component';
// Import other components you might have
// import { MapComponent } from './map/map.component'; // Example for a MapComponent

@NgModule({
  declarations: [
    AppComponent,
    // MapComponent, // Other components should be declared here
    // ... any other components
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule // Include AppRoutingModule in the imports array
  ],
  providers: [],
  bootstrap: [AppComponent] // Bootstrap the AppComponent
})
export class AppModule { }

