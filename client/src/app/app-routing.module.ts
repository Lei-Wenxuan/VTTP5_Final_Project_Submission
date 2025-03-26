import { NgModule } from '@angular/core';
import {
  provideRouter,
  RouterModule,
  Routes,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CallbackComponent } from './components/callback/callback.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AppLayout } from './layout/component/app.layout';

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'callback', component: CallbackComponent },
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: 'calendar',
        component: CalendarComponent,
      },
      {
        path: 'list',
        component: TaskListComponent,
      },
    ],
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withEnabledBlockingInitialNavigation(),
    ),
  ],
})
export class AppRoutingModule {}
