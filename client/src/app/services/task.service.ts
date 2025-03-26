import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TaskEvent } from '../models/task-event';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  private apiUrl = '/api/tasks';

  completed: TaskEvent[] = [];

  getAllTasks(): Observable<TaskEvent[]> {
    return this.http
      .get<TaskEvent[]>(this.apiUrl, { withCredentials: true })
      .pipe(
        map((tasks) => tasks.map((task) => this.mapToFrontendFormat(task))),
      );
  }

  createTask(task: TaskEvent): Observable<TaskEvent> {
    return this.http.post<TaskEvent>(
      this.apiUrl,
      this.mapToBackendFormat(task),
      {
        withCredentials: true,
      },
    );
  }

  updateTask(task: TaskEvent): Observable<TaskEvent> {
    return this.http.put<TaskEvent>(
      `${this.apiUrl}/${task.id}`,
      this.mapToBackendFormat(task),
      { withCredentials: true },
    );
  }

  deleteTask(task: TaskEvent): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${task.id}`, {
      withCredentials: true,
    });
  }

  private mapToBackendFormat(task: TaskEvent): any {
    return {
      taskid: task.id,
      start: task.start,
      end: task.end,
      title: task.title,
      allDay: task.allDay,
      resizable: task.draggable,
      tags: Array.isArray(task.tags) ? task.tags : [task.tags],
      body: task.body,
      complete: task.complete,
    };
  }

  private mapToFrontendFormat(task: any): TaskEvent {
    return {
      id: task.taskid,
      start: new Date(task.start),
      end: task.end ? new Date(task.end) : undefined,
      title: task.title,
      allDay: task.allDay || false,
      resizable: {
        beforeStart: task.resizable || false,
        afterEnd: task.resizable || false,
      },
      draggable: task.resizable || false,
      tags: Array.isArray(task.tags) ? task.tags : [task.tags],
      body: task.body || '',
      complete: task.complete,
    };
  }
}
