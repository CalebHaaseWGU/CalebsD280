import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  //it(`should have as title 'your-project-name'`, () => {
   // const fixture = TestBed.createComponent(AppComponent);
   // const app = fixture.componentInstance;
    //expect(app.title).toEqual('your-project-name');
  //});

  //it('should render title', () => {
   // const fixture = TestBed.createComponent(AppComponent);
   // fixture.detectChanges();
   // const compiled = fixture.nativeElement as HTMLElement;
   // expect(compiled.querySelector('.content span')?.textContent).toContain('your-project-name app is running!');
 // });
});
