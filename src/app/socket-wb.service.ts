import { Injectable } from '@angular/core';
import { Subject,Observer } from 'rxjs';
import * as Rx from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketWbService {

public messages: Subject<any>;
private subject: Subject<any>;
public ws: any;
constructor() {
}
public connect(url: string): Subject<any> {
    if (!this.subject) {
        this.subject = this.create(url);
    }
    return this.subject;
}

private create(url: string): Subject<any> {
  this.ws = new WebSocket(url);
  const observable = Rx.Observable.create(
      (obs: Observer<any>) => {
          this.ws.onmessage = obs.next.bind(obs);
          this.ws.onerror = obs.error.bind(obs);
          this.ws.onclose = obs.complete.bind(obs);
          return this.ws.close.bind(this.ws);
      }).share();

  const observer = {
      next: (data: Object) => {
          if (this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(JSON.stringify(data));
          }
      }
  };
  return Rx.Subject.create(observer, observable);
}

public close() {
  if (this.ws) {
      this.ws.close();
      this.subject = null;
  }
}
}