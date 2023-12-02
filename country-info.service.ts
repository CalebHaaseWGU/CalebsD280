import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryInfoService {
  private geonamesApiUrl = 'http://api.geonames.org/countryInfoJSON?username=CalebHaase';
  private worldbankApiUrl = 'https://api.worldbank.org/v2/country/';

  constructor(private http: HttpClient) { }

  // Fetch country details from GeoNames API
  getCountryDetails(): Observable<any> {
    return this.http.get(this.geonamesApiUrl);
  }

  // Fetch income level from Worldbank API for a specific country
  getCountryIncomeLevel(countryCode: string): Observable<any> {
    const url = `${this.worldbankApiUrl}${countryCode}?format=json`;
    return this.http.get(url).pipe(
      map((response: any) => {
        // Parse and extract the income level from the Worldbank API response
        return response[1]?.[0]?.incomeLevel?.value;
      })
    );
  }

  // Fetch all required country data, combining information from both APIs
  getAllCountryData(): Observable<any> {
    return this.getCountryDetails().pipe(
      map((countriesData: any) => {
        const countries = countriesData.geonames;
        // Map each country to an observable of its details including income level
        const countryDetailObservables = countries.map((country: any) =>
          this.getCountryIncomeLevel(country.countryCode).pipe(
            map(incomeLevel => ({
              ...country,
              incomeLevel: incomeLevel || 'Not available', // Fallback if income level is not found
            }))
          )
        );
        // Combine all country detail observables into a single observable
        return forkJoin(countryDetailObservables);
      })
    );
  }
}


