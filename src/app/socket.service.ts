import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Message } from '../models/message';


import * as socketIo from 'socket.io-client';

const SERVER_URL = 'ws://localhost:8090/getFlowLog';
//https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1
@Injectable()
export class SocketService {
    private socket;
    
    public initSocket(): void {
      //socketIo.set('origins', '*:*');
        this.socket = socketIo(SERVER_URL, {
          origins: '*', // I think it should be written like this right? Otherwise there would be syntax error,
//          path :'/getFlowLog'
        });
      
    }
    public disconnect():void{
      this.socket.disconnect();
    }
    public send(message: Message): void {
        this.socket.emit('message', {
          textStream:message.message
        });
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('message', (data: Message) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}


// Socket.io events
export enum Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect'
}