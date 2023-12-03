import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryInfoService {
  private geonamesApiUrl = 'http://api.geonames.org/countryInfoJSON?username=CalebHaase'; // GeoNames API URL
  private worldbankApiUrl = 'https://api.worldbank.org/v2/country/'; // World Bank API URL

  constructor(private http: HttpClient) { }

  // Fetch country details from GeoNames API
  getCountryDetails(countryCode: string): Observable<any> {
    const url = `${this.geonamesApiUrl}&country=${countryCode}`;
    return this.http.get(url).pipe(
      map(response => {
        console.log('GeoNames API response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error fetching country details:', error);
        return of(null);
      })
    );
  }

  // Fetch income level from Worldbank API for a specific country
getCountryIncomeLevel(countryCode: string): Observable<any> {
  const url = `${this.worldbankApiUrl}${countryCode}?format=json`;
  return this.http.get<any[]>(url).pipe(
    map(response => {
      // Using type assertion to inform TypeScript of the expected structure
      const data = response as any[];
      console.log('World Bank API response:', data);
      return data[1]?.[0]?.incomeLevel?.value || 'Not available';
    }),
    catchError(error => {
      console.error('Error fetching income level:', error);
      return of('Not available');
    })
  );
}


  // Fetch all required country data for a specific country
  getCountryData(countryCode: string): Observable<any> {
    return forkJoin({
      countryDetails: this.getCountryDetails(countryCode),
      incomeLevel: this.getCountryIncomeLevel(countryCode)
    }).pipe(
      map(result => {
        console.log('Combined API response:', result);
        // Existing logic to process the result...
        return result; // Replace with your existing return logic
      }),
      catchError(error => {
        console.error('Error fetching combined country data:', error);
        return of({
          // Existing error handling logic...
        });
      })
    );
  }
}

