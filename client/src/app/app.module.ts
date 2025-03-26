import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import Aura from '@primeng/themes/aura';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CallbackComponent } from './components/callback/callback.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AuthGuard } from './guard/auth.guard';
import { AppFloatingConfigurator } from './layout/component/app.floatingconfigurator';
import { MaterialModule } from './module/material.module';
import { PrimeNgModule } from './module/primeng.module';
import { AuthService } from './services/auth.service';
import { EventsService } from './services/events.service';
import { TaskService } from './services/task.service';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CallbackComponent,
    AuthComponent,
    NotfoundComponent,
    TaskListComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MaterialModule,
    PrimeNgModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule,
    DragAndDropModule,
    AppFloatingConfigurator,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
    }),
    AuthService,
    AuthGuard,
    TaskService,
    EventsService,
    ConfirmationService,
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
