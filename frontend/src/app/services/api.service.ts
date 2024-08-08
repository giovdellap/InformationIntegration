import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BasicQueryNoCountResponseItem } from '../model/queryresponses/basicQueryNoCountResponse';
import { BasicRequestQueryItem } from '../model/queryresponses/basicRequestQueryItem';
import { SatisfactionQueryItem } from '../model/queryresponses/satisfactionQueryResponse';
import { setupBothResponse } from '../model/queryresponses/setupResponse';
import { WLIBoxPlotqueryItem } from '../model/queryresponses/wliBoxPlotQueryItem';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = "http://localhost:5001"

  constructor(private http: HttpClient) { }

  // SERVICE SETTINGS

  getLogObservable(request: Observable<any>) {
    return request.pipe(tap((response: any) => {
      //console.log('RESPONSE: ', response)
    }))
  }

  // QUERY

  getBasicQuery(field1: string, field2: string, model: string): Observable<SatisfactionQueryItem[]> {
    let body = {
      field1: field1,
      field2: field2,
    }
    return this.getLogObservable(
      this.http.post<SatisfactionQueryItem[]>(this.url + "/query/sessionQuery", body)
    )
  }

  getBasicQueryNoCOunt(field1: string, field2: string, model: string): Observable<BasicQueryNoCountResponseItem[]> {
    let body = {
      field1: field1,
      field2: field2,
    }
    return this.getLogObservable(
      this.http.post<BasicQueryNoCountResponseItem[]>(this.url + "/query/sessionQueryNoCount", body)
    )
  }

  getwliBoxplotQuery(field: string, model: string): Observable<WLIBoxPlotqueryItem[]> {
    let body = {
      field: field,
    }
    return this.getLogObservable(this.http.post<WLIBoxPlotqueryItem[]>(this.url + "/query/wliboxplotquery", body))
  }

  getBasicRequestQuery(field: string): Observable<BasicRequestQueryItem[]> {
    let body = {
      field: field
    }
    return this.getLogObservable(this.http.post<BasicRequestQueryItem[]>(this.url + '/query/basicRequestQuery', body))
  }

  getBasicRequestQueryNoCount(field: string): Observable<BasicRequestQueryItem[]> {
    let body = {
      field: field
    }
    return this.getLogObservable(this.http.post<BasicRequestQueryItem[]>(this.url + '/query/basicRequestQueryNoCount', body))
  }

  getPCARequestQuery(field: string): Observable<BasicRequestQueryItem[]> {
    let body = {
      field: field
    }
    return this.getLogObservable(this.http.post<BasicRequestQueryItem[]>(this.url + '/query/pcaquery', body))
  }

  getLineChartQuery(field1: string, field2: string, model: string): Observable<BasicQueryNoCountResponseItem[]> {
    let body = {
      field1: field1,
      field2: field2,
      model_filter: model
    }
    return this.getLogObservable(this.http.post<BasicQueryNoCountResponseItem[]>(this.url + '/query/linechartQuery', body))
  }

  //INSERTION

  initializeDB(db: string) {
    return this.http.post<BasicRequestQueryItem[]>(this.url + '/insertion/initializeDB', {db: db})
  }

  insertOneMonth(db: string) {
    let body = {
      year: 2024,
      month: 6,
      db: db
    }
    return this.http.post<BasicRequestQueryItem[]>(this.url + '/insertion/insertOneMonth', body)
  }

  setupBoth() {
    let body = {
      year: 2024,
      month: 6,
    }
    return this.http.post<setupBothResponse>(this.url + '/insertion/setupBothDB', body)
  }

}
