import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class Network {
  private http = inject(HttpClient);
  private constant = inject(Constants);

  // Prepare request headers and attach Cognito access token
  private async getHeaders(auth: boolean): Promise<HttpHeaders> {
    const headers: Record<string, string> = {};

    if (auth) {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

      if (!token) {
        const error = new Error('Access token not found');
        Object.assign(error, { status: 401 });
        throw error;
      }

      headers['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }

  // Make HTTP request
  private async makeRequest(
    method: string,
    url: string,
    body: any = {},
    auth: boolean = true,
  ): Promise<any> {
    const headers = await this.getHeaders(auth);
    const apiUrl = this.constant.apiUrl + url;

    switch (method.toUpperCase()) {
      case 'GET':
        return await firstValueFrom(this.http.get(apiUrl, { headers }));

      case 'POST':
        return await firstValueFrom(this.http.post(apiUrl, body, { headers }));

      case 'PUT':
        return await firstValueFrom(this.http.put(apiUrl, body, { headers }));

      case 'DELETE':
        return await firstValueFrom(this.http.delete(apiUrl, { headers }));

      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  // Common API entry point
  async callAPI(method: string, url: string, body: any = {}, auth: boolean = true): Promise<any> {
    try {
      return await this.makeRequest(method, url, body, auth);
    } catch (error: any) {
      if (auth && error?.status === 401) {
        await this.unauthorizedErrorAlert();
        throw error;
      }

      this.handleErrors(error);
      throw error;
    }
  }

  // Common HTTP error handling
  private handleErrors(error: HttpErrorResponse): void {
    if ([400, 403, 404, 409].includes(error.status)) {
      alert(error.error?.message || 'Something went wrong.');
    } else if ([500, 501, 502, 503, 504].includes(error.status)) {
      alert('Server error. Please try again later.');
    } else if (error.status === 0) {
      alert('Unable to connect to the server. Please check your internet connection.');
    } else {
      alert('An unexpected error occurred. Please try again.');
      console.error('Unexpected error:', error);
    }
  }

  // Sign out when an authenticated request receives 401
  private async unauthorizedErrorAlert(): Promise<void> {
    try {
      await signOut();
    } catch (error) {
      console.error('Unable to sign out:', error);
    }
  }
}
