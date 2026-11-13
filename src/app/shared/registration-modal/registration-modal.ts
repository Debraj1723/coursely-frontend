import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Api } from '../../services/api';
import { CourseCard } from '../course-card/course-card';

@Component({
  selector: 'app-registration-modal',
  imports: [CourseCard],
  templateUrl: './registration-modal.html',
  styleUrl: './registration-modal.scss',
})
export class RegistrationModal {
  private api = inject(Api);

  @Output() close = new EventEmitter<void>();

  registrations = signal<any[]>([]);

  ngOnInit(): void {
    this.getRegistrations();
  }

  async getRegistrations(): Promise<void> {
    const response = await this.api.getMyRegistrations();
    if (!response) return;
    this.registrations.set(response || []);
  }

  async onUnregister(courseId: string): Promise<void> {
    const confirmed = confirm('Are you sure you want to unregister from this course?');

    if (!confirmed) return;

    const response: any = await this.api.unregisterCourse(courseId);

    if (!response) return;

    alert('You have successfully unregistered from the course.');

    await this.getRegistrations();
  }
}
