import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { TaskEvent } from '../../models/task-event';
import { EventsService } from '../../services/events.service';
import { OAuthService } from '../../services/oauth.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  private taskService = inject(TaskService);
  private eventService = inject(EventsService);
  private oAuthService = inject(OAuthService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh$ = new Subject<void>();

  allEvents: TaskEvent[] = [];
  allTasks: TaskEvent[] = [];
  publicHolidays: TaskEvent[] = [];
  googleCalendarEvents: TaskEvent[] = [];

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.allEvents = [...this.allEvents, ...tasks];
        this.allTasks = tasks;
        this.refresh$.next();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load task events:', err),
    });

    this.eventService.getPublicHolidays().subscribe({
      next: (events) => {
        this.allEvents = [...this.allEvents, ...events];
        this.publicHolidays = events;
        this.refresh$.next();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load public holidays:', err),
    });

    this.eventService.getGCalEvents().subscribe({
      next: (events) => {
        this.allEvents = [...this.allEvents, ...events];
        this.googleCalendarEvents = events;
        this.refresh$.next();
        this.cdr.detectChanges();
      },
      error: (err) =>
        console.error('Failed to load google calendar events:', err),
    });
  }

  addTask(newTask: TaskEvent) {
    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        this.allEvents = [...this.allEvents, createdTask];
        this.allTasks = [...this.allTasks, createdTask];
        this.refresh$.next();
      },
      error: (err) => console.error('Failed to create event:', err),
    });
  }

  createNewTask(): void {
    const newTask: TaskEvent = {
      title: 'New event',
      start: new Date(),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      complete: false,
    };
    this.addTask(newTask);
  }

  updateTask(updatedTask: TaskEvent) {
    this.taskService.updateTask(updatedTask).subscribe({
      next: (task) => {
        const indexAll = this.allEvents.findIndex((t) => t.id === task.id);
        this.allEvents[indexAll] = task;
        const index = this.allTasks.findIndex((t) => t.id === task.id);
        this.allTasks[index] = task;
        this.refresh$.next();
      },
      error: (err) => console.error('Failed to update event:', err),
    });
  }

  deleteTask(taskToDelete: TaskEvent) {
    this.taskService.deleteTask(taskToDelete).subscribe({
      next: () => {
        this.allEvents = this.allEvents.filter(
          (task) => task.id !== taskToDelete.id,
        );
        this.allTasks = this.allTasks.filter(
          (task) => task.id !== taskToDelete.id,
        );
        this.refresh$.next();
      },
      error: (err) => console.error('Failed to delete event:', err),
    });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    const updatedTask = { ...event, start: newStart, end: newEnd };
    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        this.allEvents = this.allEvents.map((iEvent) =>
          iEvent === event ? updatedTask : iEvent,
        );
        this.allTasks = this.allTasks.map((iEvent) =>
          iEvent === event ? updatedTask : iEvent,
        );
        this.refresh$.next();
      },
      error: (err) => console.error('Failed to update event:', err),
    });
  }

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: TaskEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  formatTags(task: any) {
    if (typeof task.tags === 'string') {
      task.tags = task.tags.split(',').map((tag: string) => tag.trim());
    }
  }

  onLoginClick() {
    this.oAuthService.getOAuthUrl().subscribe((url) => {
      window.location.href = url;
    });
  }
}
