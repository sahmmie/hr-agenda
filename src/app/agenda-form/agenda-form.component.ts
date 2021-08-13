import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { FormsService } from '../services/forms.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { agenda } from '../interface/agenda.config';

@Component({
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AgendaFormComponent implements OnInit {
  agendaForm: FormGroup = this.formBuilder.group({
    id: [
      '',
    ],
    title: [
      '',
      [
        Validators.required,
      ],
    ],
    description: [
      '',
      [
        Validators.required,
      ],
    ],
    startDate: [
      '',
      [
        Validators.required,
      ],
    ],
    endDate: [
      '',
      [
        Validators.required,
      ],
    ],
    priority: [
      '',
      [
        Validators.required,
      ],
    ],
    status: [
      false,
      [
        Validators.required,
      ],
    ],
  });
  constructor(
    private formBuilder: FormBuilder,
    private formsService: FormsService,
    public dialogRef: MatDialogRef<AgendaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: agenda) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.agendaForm.reset(this.data);
    }
  }
  save(): void {
    if (!this.agendaForm.value.id) {
      this.agendaForm.value.id = Math.random().toString(36).substring(7);
    }
    this.formsService.postAgenda(this.agendaForm.value).pipe(
      take(1)).subscribe(
        data => {
          this.agendaForm.reset();
          this.formsService.getAgendas();
          this.closeDialog();
        }
      );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
