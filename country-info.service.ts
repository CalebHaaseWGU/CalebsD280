import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define an interface for the expected structure of the GeoNames API response
interface GeoNamesResponse {
  geonames: Array<{
    countryName: string;
    capital: string;
    continentName: string;
    // Add any other properties that might be in the response
  }>;
}

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
    return this.http.get<GeoNamesResponse>(url).pipe(
      map(response => {
        // Access the geonames array in the response to get the country data
        const countryData = response.geonames[0]; // Get the first (and likely only) item
        return {
          name: countryData.countryName,
          capital: countryData.capital,
          region: countryData.continentName
          // Add any other properties you need to extract from the response
        };
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
        const data = response[1][0]; // Access the data for the country
        return data.incomeLevel.value || 'Not available';
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
        return {
          ...result.countryDetails,
          incomeLevel: result.incomeLevel
        };
      }),
      catchError(error => {
        console.error('Error fetching combined country data:', error);
        return of({
          name: 'Unavailable',
          capital: 'Unavailable',
          region: 'Unavailable',
          incomeLevel: 'Unavailable'
        });
      })
    );
  }
}
