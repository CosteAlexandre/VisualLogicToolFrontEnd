import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Node} from '../models/node';
import {FlowJson} from '../models/flow-json';
import {AllFlowJson} from '../models/all-flow-json';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
}; 

@Injectable({
  providedIn: 'root'
})
export class NodesTemplateService {

  private serverurl = 'http://localhost:8090';

  constructor(
    private http: HttpClient) { }
  
  getNodes(): Observable<Node[]> {
    return this.http.get<Node[]>(this.serverurl+'/getNodesInformations',httpOptions).pipe(
      catchError(this.handleError)
    );
            
  } 
 
  addFlow (flow: FlowJson): Observable<any> {
    console.log("SENDING FLow");
    return this.http.post<any>(this.serverurl+'/logicFlow', flow, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteFlow (id:string): Observable<any> {
    console.log("SENDING delete");
    return this.http.post<any>(this.serverurl+'/deleteFlow', id, httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getAllFlow (): Observable<AllFlowJson> {
    console.log("Getting all flow");
    return this.http.get<AllFlowJson>(this.serverurl+'/getAllFlow',httpOptions).pipe(
      catchError(this.handleError)
    );
  }
getFlowGraph (id:string): Observable<FlowJson> {
  console.log("Getting all flow");
  return this.http.post<FlowJson>(this.serverurl+'/getFlowGraph',id,httpOptions).pipe(
    catchError(this.handleError)
  );
}
getFlowLog (id:string): Observable<string[]> {
  console.log("Getting flow Log");
  return this.http.post<string[]>(this.serverurl+'/getFlowLog',id,httpOptions).pipe(
    catchError(this.handleError)
  );
}
requestNode (api:string): Observable<any> {
  console.log("api : " + api);
  return this.http.get<any>(this.serverurl+api,httpOptions).pipe(
    catchError(this.handleError)
  );
}
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}
