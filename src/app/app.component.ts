import { Component, OnInit, ViewChild } from '@angular/core';
import { AgendaFormComponent } from './agenda-form/agenda-form.component';
import { Agenda } from './interface/agenda.config';
import { MatDialog } from '@angular/material/dialog';
import { FormsService } from './services/forms.service';
import { map, take } from 'rxjs/operators';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hr-test';
  @ViewChild('inputUpload', { static: false }) fileImportInput: any;
  constructor(public dialog: MatDialog, public formsService: FormsService, private ngxCsvParser: NgxCsvParser) {
  }

  ngOnInit(): void {
  }

  openForm(): void {
    const dialogRef = this.dialog.open(AgendaFormComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe();
  }

  edit(data: Agenda): void {
    const dialogRef = this.dialog.open(AgendaFormComponent, {
      width: '800px',
      data: {
        ...data,
      }
    });
  }

  editStatus(data: Agenda): void {
    this.formsService.postAgenda(data)
      .subscribe();
  }

  delete(data: Agenda): void {
    this.formsService.deleteAgenda(data).subscribe(
      (val) => this.formsService.getAgendas(),
      err => console.log(err)
    );
  }

  exportData(): void {
    const options = {
      showLabels: true,
      headers: ['id', 'title', 'description', 'starts', 'ends', 'priority', 'status']
    };
    this.formsService.agenda$.pipe(
      take(1),
      map(data => {
        console.log(data);
        return new ngxCsv(data, `agenda ${Date.now()}`, options);
      })
    ).subscribe(
      (v) => console.log(v)
    );
  }

  fileChangeListener($event: any): void {
    console.log($event);

    // Select the files from the event
    const files = $event.srcElement.files;

    // Parse the file you want to select for the operation along with the configuration
    this.ngxCsvParser.parse(files[0], { header: true, delimiter: ',' })
      .pipe().subscribe(
        (res) => {
          if (Array.isArray(res)) {
            this.uploadForEach(res);
          }
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
        });

  }

  uploadForEach(data: any[]): void {
    for (let index = 0; index < data.length; index++) {
      const agendaDirty = data[index];
      const agenda = {
        id: agendaDirty.id,
        title: agendaDirty.title,
        description: agendaDirty.description,
        starts: agendaDirty.starts,
        ends: agendaDirty.ends,
        priority: agendaDirty.priority,
        status: agendaDirty.status === 'TRUE' ? true : false,
      };
      this.formsService.postAgenda(agenda).subscribe();
    }
    this.formsService.getAgendas();
  }
}
