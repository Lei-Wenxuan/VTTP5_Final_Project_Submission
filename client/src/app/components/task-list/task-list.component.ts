import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { TaskEvent } from '../../models/task-event';
import { TaskService } from '../../services/task.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  taskDialog: boolean = false;
  submitted: boolean = true;
  allTasks: TaskEvent[] = [];
  selectedTasks: TaskEvent[] = [];
  task!: TaskEvent;

  existingTags!: Set<string>;
  filteredTagInput = '';
  newTagOption = '__NEW_TAG__';

  statuses!: any[];
  cols!: Column[];
  @ViewChild('dt') dt!: Table;
  exportColumns!: ExportColumn[];
  refresh$ = new Subject<void>();

  private taskService = inject(TaskService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadEvents();
    this.refresh$.next();
  }

  private loadEvents(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.existingTags = new Set(
          this.allTasks.flatMap((task) => task.tags || []),
        );
        this.refresh$.next();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load task events:', err),
    });

    this.statuses = [
      { label: 'COMPLETE', value: true },
      { label: 'NOT STARTED', value: false },
    ];

    this.cols = [
      { field: 'title', header: 'Title', customExportHeader: 'Task' },
      { field: 'tags', header: 'Tags' },
      { field: 'start', header: 'Start' },
      { field: 'end', header: 'End' },
      { field: 'body', header: 'Description' },
      { field: 'complete', header: 'Complete' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  createOrUpdateTask(editedTask: TaskEvent) {
    if (this.submitted == false) {
      this.addTask(editedTask);
      this.submitted = true;
    } else {
      this.updateTask(editedTask);
    }
    this.taskDialog = false;
    this.cdr.detectChanges();
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
    this.task = newTask;
    this.submitted = false;
    this.taskDialog = true;
  }

  addTask(newTask: TaskEvent) {
    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        this.allTasks = [...this.allTasks, createdTask];
        this.refresh$.next();
        this.cdr.detectChanges();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Task Added',
          life: 3000,
        });
      },
      error: (err) => console.error('Failed to create event:', err),
    });
  }

  editTask(task: TaskEvent): void {
    this.task = task;
    this.taskDialog = true;
  }

  updateTask(updatedTask: TaskEvent) {
    this.taskService.updateTask(updatedTask).subscribe({
      next: (task) => {
        const index = this.allTasks.findIndex((t) => t.id === task.id);
        this.allTasks[index] = task;
        this.refresh$.next();
        this.cdr.detectChanges();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Task Updated',
          life: 3000,
        });
      },
      error: (err) => console.error('Failed to update event:', err),
    });
  }

  markAsComplete(completedTask: TaskEvent) {
    const updatedTask: TaskEvent = {
      ...completedTask,
      complete: true,
    };
    return updatedTask;
  }

  updateSelectedTasks() {
    this.confirmationService.confirm({
      message: 'Mark the selected tasks as complete?',
      header: 'Confirm',
      icon: 'pi pi-face-smile',
      accept: () => {
        this.selectedTasks.map((task) =>
          this.updateTask(this.markAsComplete(task)),
        );
        this.selectedTasks = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Completed Selected Tasks',
          life: 3000,
        });
      },
    });
  }

  deleteOneTask(task: TaskEvent) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + task.title + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteTask(task);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Task Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteSelectedTasks() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected tasks?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedTasks.map((task) => this.deleteTask(task));
        this.selectedTasks = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Selected Tasks Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteTask(taskToDelete: TaskEvent) {
    this.taskService.deleteTask(taskToDelete).subscribe({
      next: () => {
        this.allTasks = this.allTasks.filter(
          (task) => task.id !== taskToDelete.id,
        );
        this.refresh$.next();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to delete event:', err),
    });
  }

  hideDialog() {
    this.taskDialog = false;
    this.submitted = false;
  }

  formatTags(task: any) {
    if (typeof task.tags === 'string') {
      task.tags = task.tags.split(',').map((tag: string) => tag.trim());
    }
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getFilteredTags(): string[] {
    const filtered = Array.from(this.existingTags).filter((tag) =>
      tag.toLowerCase().includes(this.filteredTagInput.toLowerCase()),
    );

    if (
      this.filteredTagInput &&
      !this.existingTags.has(this.filteredTagInput)
    ) {
      filtered.push(this.newTagOption);
    }

    return filtered;
  }

  onTagFilter(event: any) {
    this.filteredTagInput = event.filter;
  }

  onTagKeyPress(event: any) {
    if (event.key === 'Enter' && this.filteredTagInput) {
      this.addNewTag(this.filteredTagInput);
    }
  }

  addNewTag(tagName: string) {
    const newTag = tagName.trim();
    if (!newTag) return;

    this.existingTags.add(newTag);

    if (!this.task.tags) this.task.tags = [];
    this.task.tags = [...this.task.tags, newTag];

    this.filteredTagInput = '';
  }

  removeTag(tagToRemove: string) {
    if (this.task.tags)
      this.task.tags = this.task.tags.filter((t) => t !== tagToRemove);
  }

  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'info';
      default:
        return 'warn';
    }
  }

  getStatus(status: boolean) {
    switch (status) {
      case true:
        return 'COMPLETE';
      case false:
        return 'TODO';
      default:
        return 'STATUS';
    }
  }
}
