import { Component, ElementRef, Renderer2, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  svgContent: any; // Let's change it to any to accommodate different types, including SafeHtml
  svgContentLoaded = false; // Flag to indicate when the SVG is loaded and ready to have event listeners

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadSvgContent();
  }

  ngAfterViewInit(): void {
    this.changeDetector.detectChanges();
  }

  ngAfterViewChecked(): void {
    if (this.svgContentLoaded) {
      this.addEventListenersToCountryPaths();
      // Reset the flag to avoid multiple additions
      this.svgContentLoaded = false;
    }
  }

  private loadSvgContent(): void {
    this.http.get('assets/world (1).svg', { responseType: 'text' })
      .subscribe({
        next: (svgData: string) => {
          // Bypass security for SVG content assuming it is sanitized and secure
          this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svgData);
          this.svgContentLoaded = true; // Indicate that SVG content is loaded
          this.changeDetector.detectChanges(); // Detect changes to update the view
        },
        error: (error) => {
          console.error('Error loading SVG content:', error);
        }
      });
  }

  private addEventListenersToCountryPaths(): void {
    console.log('Adding event listeners...');
    const svgElement: SVGElement | null = this.elRef.nativeElement.querySelector('svg');
    if (svgElement) {
      const paths = svgElement.querySelectorAll('path');
      paths.forEach((path) => {
        this.renderer.listen(path, 'mouseover', (event) => this.onCountryHover(event));
        this.renderer.listen(path, 'mouseout', (event) => this.onCountryOut(event));
        this.renderer.listen(path, 'click', (event) => this.onCountrySelect(event));
      });
      console.log('Event listeners added');
    }
  }

  onCountryHover(event: MouseEvent): void {
    const countryElement = event.target as SVGElement;
    countryElement.classList.add('hovered');
    console.log('Hovered:', countryElement.id);
  }

  onCountryOut(event: MouseEvent): void {
    const countryElement = event.target as SVGElement;
    countryElement.classList.remove('hovered');
    console.log('Hover out:', countryElement.id);
  }

  onCountrySelect(event: MouseEvent): void {
    const countryElement = event.target as SVGElement;
    console.log('Selected:', countryElement.id);
    // Perform additional actions here, like an API call using the country ID
  }
}
