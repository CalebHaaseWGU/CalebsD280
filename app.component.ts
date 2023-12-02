import { Component, ElementRef, Renderer2, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  svgContent: any; // This will hold the SVG content
  svgContentLoaded = false; // Flag to indicate when the SVG content is loaded and ready

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer // Sanitizer to bypass HTML sanitization
  ) {}

  ngOnInit(): void {
    this.loadSvgContent(); // Load the SVG content when the component initializes
  }

  ngAfterViewInit(): void {
    // Use this hook to add event listeners after the view has been initialized
    // This ensures the SVG is in the DOM before adding listeners
  }

  ngAfterViewChecked(): void {
    // Each time the view is checked, we see if the SVG content is ready
    // If it is, we add event listeners
    if (this.svgContentLoaded) {
      this.addEventListenersToCountryPaths();
      this.svgContentLoaded = false; // Reset the flag to avoid adding listeners more than once
    }
  }

  private loadSvgContent(): void {
    this.http.get('assets/world (1).svg', { responseType: 'text' })
      .subscribe({
        next: (svgData: string) => {
          this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svgData);
          this.svgContentLoaded = true; // Signal that the content is loaded and listeners can be added
          // Detect changes to ensure Angular updates the DOM with the SVG content
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          console.error('Failed to load the SVG content:', error);
        }
      });
  }

  private addEventListenersToCountryPaths(): void {
    // This is where we add the mouse event listeners
    const svgElement: SVGElement | null = this.elRef.nativeElement.querySelector('svg');
    if (svgElement && !this.svgContentLoaded) {
      const paths = svgElement.querySelectorAll('path');
      paths.forEach((path) => {
        this.renderer.listen(path, 'mouseover', (event) => this.onCountryHover(event));
        this.renderer.listen(path, 'mouseout', (event) => this.onCountryOut(event));
        this.renderer.listen(path, 'click', (event) => this.onCountrySelect(event));
      });
      this.svgContentLoaded = true; // Prevent adding event listeners multiple times
    }
  }

  // Event handler for mouseover
  onCountryHover(event: Event): void {
    const targetElement = event.target as Element;
    targetElement.classList.add('hovered'); // Add 'hovered' class for styling
  }

  // Event handler for mouseout
  onCountryOut(event: Event): void {
    const targetElement = event.target as Element;
    targetElement.classList.remove('hovered'); // Remove 'hovered' class
  }

  // Event handler for click
  onCountrySelect(event: Event): void {
    const targetElement = event.target as Element;
    const countryCode = targetElement.id;
    // Call an API or perform other actions using countryCode
    console.log('Country selected:', countryCode);
  }
}
