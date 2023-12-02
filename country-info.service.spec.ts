import { TestBed } from '@angular/core/testing';

import { CountryInfoService } from './country-info.service';

describe('CountryInfoService', () => {
  let service: CountryInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
