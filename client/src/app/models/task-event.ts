import { CalendarEvent } from 'calendar-utils';

export interface TaskEvent extends CalendarEvent {
  tags?: string[];
  body?: string;
  complete?: boolean;
}

// export interface CalendarEvent<MetaType = any> {
//     id?: string | number;
//     start: Date;
//     end?: Date;
//     title: string;
//     color?: EventColor;
//     actions?: EventAction[];
//     allDay?: boolean;
//     cssClass?: string;
//     resizable?: {
//         beforeStart?: boolean;
//         afterEnd?: boolean;
//     };
//     draggable?: boolean;
//     meta?: MetaType;
// }
