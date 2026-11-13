import { inject, Injectable } from '@angular/core';
import { Network } from './network';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private network = inject(Network);

  async getCourses() {
    try {
      const response = await this.network.callAPI('GET', 'courses', {}, false);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async registerCourse(courseId: string) {
    try {
      const response = await this.network.callAPI('POST', 'registrations', { courseId }, true);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getMyRegistrations() {
    try {
      const response = await this.network.callAPI('GET', 'registrations', {}, true);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async unregisterCourse(courseId: string) {
    try {
      const response = await this.network.callAPI('DELETE', `registrations/${courseId}`, {}, true);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
