import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-svg-map', // Use the actual selector
  templateUrl: './svg-map.component.html', // Use the actual template URL
  styleUrls: ['./svg-map.component.css'] // Use the actual stylesheet URL
})
export class SvgMapComponent implements OnInit {
  // Use the definite assignment assertion (!) to indicate to TypeScript
  // that this property will be assigned later by Angular's lifecycle.
  @ViewChild('svgMapContainer') svgMapElementRef!: ElementRef;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('assets/world.svg', { responseType: 'text' })
      .subscribe(
        (svgContent) => {
          this.svgMapElementRef.nativeElement.innerHTML = svgContent;
        },
        (error) => {
          console.error('Error when trying to load SVG:', error);
        }
      );
  }

  // ... Any additional methods, inputs, outputs, and lifecycle hooks
}
