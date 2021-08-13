import { Component, OnInit } from '@angular/core';
import { AgendaFormComponent } from './agenda-form/agenda-form.component';
import { agenda } from './interface/agenda.config';
import { MatDialog } from '@angular/material/dialog';
import { FormsService } from './services/forms.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hr-test';
  constructor(public dialog: MatDialog, public formsService: FormsService) {
  }

  ngOnInit(): void {
    this.formsService.agenda$.subscribe((data) => {
      console.log(data);
    });
  }

  openForm(): void {
    const dialogRef = this.dialog.open(AgendaFormComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe();
  }

  edit(data: agenda): void {
    const dialogRef = this.dialog.open(AgendaFormComponent, {
      width: '800px',
      data: {
        ...data,
      }
    });
  }

  delete(data: agenda): void {
    this.formsService.deleteAgenda(data).subscribe(
      (val) => console.log(val),
      err => console.log(err)
    );
  }
}
