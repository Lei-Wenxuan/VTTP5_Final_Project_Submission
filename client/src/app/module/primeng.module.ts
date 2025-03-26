import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
const PRIMENG = [
  ButtonModule,
  CheckboxModule,
  ChipModule,
  ConfirmDialogModule,
  DialogModule,
  IconFieldModule,
  InputIconModule,
  InputNumberModule,
  InputTextModule,
  MessageModule,
  MultiSelectModule,
  PasswordModule,
  ProgressBarModule,
  RadioButtonModule,
  RatingModule,
  RippleModule,
  SelectModule,
  SliderModule,
  TableModule,
  TagModule,
  TextareaModule,
  ToastModule,
  ToggleButtonModule,
  ToolbarModule,
];
@NgModule({
  imports: PRIMENG,
  exports: PRIMENG,
})
export class PrimeNgModule {}
