import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-course-card',
  imports: [],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCard {
  @Input() mode: 'available' | 'registered' = 'available';

  @Input() course: any;

  @Output() enroll = new EventEmitter<string>();

  @Output() unregister = new EventEmitter<string>();

  onEnroll(): void {
    this.enroll.emit(this.course.courseId);
  }

  onUnregister(): void {
    this.unregister.emit(this.course.courseId);
  }
}
