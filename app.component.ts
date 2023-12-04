import { Component, ElementRef, Renderer2, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Import DomSanitizer for SafeHtml
import { CountryInfoService } from './country-info.service'; // Update the path to match your service's location

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  svgContent!: SafeHtml;
  svgContentLoaded = false; // Flag indicating SVG content has been loaded
  // Initialize countryInfo with empty values
  countryInfo = { name: '', capital: '', region: '', incomeLevel: '' };

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private countryInfoService: CountryInfoService // Add the CountryInfoService
  ) {}

  ngOnInit(): void {
    this.loadSvgContent();
  }

  ngAfterViewInit(): void {
    // Detect changes to ensure the rendered SVG content is up-to-date
    this.changeDetector.detectChanges();
  }

  ngAfterViewChecked(): void {
    // Add event listeners if the SVG content is ready
    if (this.svgContentLoaded) {
      this.addEventListenersToCountryPaths();
      this.svgContentLoaded = false; // Prevent adding listeners more than once
    }
  }

  private loadSvgContent(): void {
    this.http.get('assets/world (1).svg', { responseType: 'text' })
      .subscribe({
        next: (svgData: string) => {
          this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svgData);
          this.svgContentLoaded = true; // The content is now ready
          this.changeDetector.detectChanges(); // Detect changes to update the view
        },
        error: (error) => {
          console.error('Failed to load SVG content:', error);
        }
      });
  }

  private addEventListenersToCountryPaths(): void {
    const svgElement: SVGElement | null = this.elRef.nativeElement.querySelector('svg');
    if (svgElement) {
      const paths = svgElement.querySelectorAll('path');
      paths.forEach((path) => {
        this.renderer.listen(path, 'mouseover', (event) => this.onCountryHover(event));
      });
      console.log('Event listeners added to SVG paths.');
    }
  }

  onCountryHover(event: MouseEvent): void {
    const countryElement = event.target as SVGElement;
    const countryId = countryElement.id;
    console.log('Hovered over country ID:', countryId);
  
    this.countryInfoService.getCountryData(countryId).subscribe({
      next: (data) => {
        this.countryInfo = {
          name: data.countryDetails?.name || 'Country name',
          capital: data.countryDetails?.capital || 'Capital City',
          region: data.countryDetails?.region || 'Region Name',
          incomeLevel: data.incomeLevel || 'Income Level'
          // ... any other properties
        };
      },
      error: (error) => {
        console.error('Error fetching country data:', error);
        // Handle error case
      }
    });
    
  
    countryElement.classList.add('hovered');
  }

  // Event handler method for mouseout to clear information
  onCountryOut(event: MouseEvent): void {
    const countryElement = event.target as SVGElement;
    countryElement.classList.remove('hovered');
    // Optionally clear country info when not hovering
    this.countryInfo = { name: '', capital: '', region: '', incomeLevel: ''};
  }

  // Additional methods such as onCountrySelect would go here...
}
