import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { Agenda } from '../interface/agenda.config';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  agenda$: BehaviorSubject<Agenda[] | null>;
  constructor() {
    this.agenda$ = new BehaviorSubject<Agenda[] | null>(null);
    this.getAgendas();
  }

  postAgenda(agendaData: Agenda): Observable<Agenda[]> {
    return this.saveDataToStore(agendaData);
  }

  patchAgenda(agendaData: Agenda): Observable<Agenda[]> {
    return this.saveDataToStore(agendaData);
  }

  deleteAgenda(agendaData: Agenda): Observable<Agenda[]> {
    return this.deleteDataFromStore(agendaData);
  }

  getAgendas(): Subscription {
    return this.getDataFromStore().pipe(
      take(1),
      map(data => {
        this.agenda$.next(data);
        return data;
      })
    ).subscribe();
  }


  // fake db
  private getDataFromStore(): Observable<Agenda[]> {
    return of(JSON.parse((localStorage.getItem('agendas') || `[]`)));
  }

  private saveDataToStore(data: Agenda): Observable<Agenda[]> {

    return this.getDataFromStore().pipe(
      switchMap(val => {
        if (val?.length) {
          // find if already exists and update it
          val.forEach(v => {
            if (v.id === data.id) {

              v.priority = data.priority;
              v.tags = data.tags;
              v.status = data.status;
              v.title = data.title;
              v.description = data.description;
              v.starts = new Date(data.starts);
              v.ends = new Date(data.ends);
              v.location = data.location;
            } else {
              val.push(data);
            }
          });
          return of(val);
        } else {
          return of([data]);
        }
      }
      ),
      map(val => {
        // remove dups
        val = val.filter((v, i, a) => a.findIndex(x => x.id === v.id) === i);
        localStorage.setItem('agendas', JSON.stringify(val));
        console.log('====================================');
        console.log(val);
        console.log('====================================');
        return (val);
      })
    );
  }

  private deleteDataFromStore(data: Agenda): Observable<Agenda[]> {

    return this.getDataFromStore().pipe(
      switchMap(val => {
        if (val?.length) {
          val.forEach(v => {
            if (v.id === data.id) {
              val.splice(val.indexOf(v), 1);
            }
          });
          return of(val);
        } else {
          return of([]);
        }
      }
      ),
      map(val => {
        localStorage.setItem('agendas', JSON.stringify(val));
        return (val);
      })
    );
  }

}
