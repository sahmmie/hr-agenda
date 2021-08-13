import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { agenda } from '../interface/agenda.config';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  agenda$: BehaviorSubject<agenda[] | null>;
  constructor() {
    this.agenda$ = new BehaviorSubject<agenda[] | null>(null);
    this.getAgendas();
  }

  postAgenda(agendaData: agenda): Observable<agenda[]> {
    return this.saveDataToStore(agendaData);
  }

  patchAgenda(agendaData: agenda): Observable<agenda[]> {
    return this.saveDataToStore(agendaData);
  }

  deleteAgenda(agendaData: agenda): Observable<agenda[]> {
    return this.deleteDataFromStore(agendaData);
  }

  getAgendas(): Subscription {
    return this.getDataFromStore().pipe(
      take(1),
      map(data => {
        data = data.filter((v, i, a) => a.findIndex(x => x.id === v.id) === i);
        console.log(data);
        this.agenda$.next(data);
        return data;
      })
    ).subscribe();
  }


  // fake db
  private getDataFromStore(): Observable<agenda[]> {
    return of(JSON.parse((localStorage.getItem('agendas') || `[]`)));
  }

  private saveDataToStore(data: agenda): Observable<agenda[]> {

    return this.agenda$.pipe(
      switchMap(val => {
        if (val?.length) {
          val.forEach(v => {
            if (v.id === data.id) {
              v.pirority = data.pirority;
              v.tags = data.tags;
              v.status = data.status;
              v.title = data.title;
              v.description = data.description;
              v.startDate = data.startDate;
              v.endDate = data.endDate;
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
        return (val);
      })
    );
  }

  private deleteDataFromStore(data: agenda): Observable<agenda[]> {

    return this.agenda$.pipe(
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
