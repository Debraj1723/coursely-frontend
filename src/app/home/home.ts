import { Component, inject, OnInit, signal } from '@angular/core';
import { Navbar } from '../shared/navbar/navbar';
import { CourseCard } from '../shared/course-card/course-card';
import { AuthModal } from '../shared/auth-modal/auth-modal';
import { RegistrationModal } from '../shared/registration-modal/registration-modal';
import { Api } from '../services/api';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-home',
  imports: [Navbar, CourseCard, AuthModal, RegistrationModal],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private api = inject(Api);

  isLoggedIn = false;

  userName = '';

  profileImage = 'assets/images/default-profile.png';

  popupStatus = false;

  popupType: 'login' | 'signup' | 'registrations' = 'login';

  authService = inject(Auth);

  courses = signal<any[]>([]);

  ngOnInit(): void {
    this.getData();
  }

  async getData() {
    const response: any = await this.api.getCourses();
    if (!response) return;
    this.courses.set(response);
  }

  togglePopup(type: 'login' | 'signup' | 'registrations'): void {
    this.popupType = type;
    this.popupStatus = true;
  }

  async registerCourse(courseId: string) {
    if (!this.authService.isAuthenticated()) {
      this.togglePopup('login');
      return;
    }
    const confirmed = confirm('Are you sure you want to enroll in this course?');
    if (!confirmed) return;
    const response: any = await this.api.registerCourse(courseId);
    if (!response) return;
    alert('Successfully enrolled in the course!');
    this.getData();
  }

  scrollToCourses(): void {
    document.getElementById('courses')?.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
