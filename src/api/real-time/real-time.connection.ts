import * as signalR from '@aspnet/signalr';
import { Observable, BehaviorSubject } from 'rxjs';

export class RealTimeConnection {
  //  Fields
  protected actionUrl: string;

  protected connectionAttempts: number;

  protected connectionError: BehaviorSubject<any>;

  protected reconnectionAttempt: BehaviorSubject<number>;

  protected rtUrl: string;

  protected started: BehaviorSubject<signalR.HubConnection | null>;

  protected transport: signalR.HttpTransportType;

  //  Properties
  public ConnectionError: Observable<any>;

  public Hub?: signalR.HubConnection;

  public MaxConnectionRetryAttempts: number;

  public ReconnectionAttempt: Observable<number>;

  public Started: Observable<signalR.HubConnection | null>;

  //  Constructors
  constructor(
    rtUrl: string,
    actionUrl: string,
    maxConnectionRetryAttempts: number = 10,
    transport: signalR.HttpTransportType = signalR.HttpTransportType.WebSockets
  ) {
    this.actionUrl = actionUrl;

    this.connectionAttempts = 0;

    this.connectionError = new BehaviorSubject(null);

    this.reconnectionAttempt = new BehaviorSubject(this.connectionAttempts);

    this.rtUrl = rtUrl;

    this.started = new BehaviorSubject<signalR.HubConnection | null>(null);

    this.transport = transport;

    this.ConnectionError = this.connectionError.asObservable();

    this.ReconnectionAttempt = this.reconnectionAttempt.asObservable();

    this.MaxConnectionRetryAttempts = maxConnectionRetryAttempts;

    this.Started = this.started.asObservable();
  }

  //  API Methods
  public Start() {
    this.buildHub().then((hub: signalR.HubConnection) => {
      this.Hub = hub;

      this.Hub.serverTimeoutInMilliseconds = 600000;

      this.Hub.onclose((err) => {
        console.log('onclose: ' + err);

        this.retryConnection();
      });

      try {
        this.Hub.start()
          .then(() => {
            this.connectionAttempts = 0;

            console.log(`Connection started`);

            this.started.next(this.Hub!);
          })
          .catch((err) => {
            console.log('Error while starting connection: ' + err);

            this.connectionError.next(err);

            this.retryConnection();
          });
      } catch (err) {
        console.log('Error while starting connection: ' + err);

        this.retryConnection();
      }
    });
  }

  public RegisterHandler(methodName: string): Observable<any> {
    return new Observable((obs) => {
      if (this.Hub) {
        try {
          this.Hub.on(methodName, (req) => {
            obs.next(req);
          });
        } catch (err) {
          console.log(`Error while handling ${methodName}: ` + err);

          obs.error(err);
        }
      } else {
        obs.error(
          'The hub must be started and configured before registering a handler.'
        );
      }
    });
  }

  public Invoke(methodName: string, ...args: any[]) {
    return new Observable((obs) => {
      if (this.Hub) {
        try {
          this.Hub.invoke(methodName, ...args)
            .then((res) => {
              obs.next(res);
            })
            .catch((e) => {
              obs.error(e);
            });
        } catch (err) {
          console.log(`Error while invoking ${methodName}: ` + err);

          obs.error(err);
        }
      } else {
        obs.error('The hub must be started and configured before invoking.');
      }
    });
  }

  //  Helpers
  protected async buildHub() {
    return new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.rtUrl, {
        transport: this.transport,
      })
      .build();
  }

  protected stop(): Promise<void> {
    return this.Hub!.stop();
  }

  /**
   * Retry connection
   */
  protected retryConnection(): void {
    if (this.connectionAttempts < this.MaxConnectionRetryAttempts) {
      console.log(`Retrying connection attempt ${this.connectionAttempts}`);

      this.connectionAttempts += 1;

      setTimeout(() => {
        this.reconnect();
      }, 1000);
    } else if (this.connectionAttempts >= this.MaxConnectionRetryAttempts) {
      this.stop().then();

      this.connectionError.next(
        'The maximum number of connection retries has been met.'
      );
    }
  }

  /**
   * Attempt to reconnect
   */
  protected reconnect(): void {
    this.reconnectionAttempt.next(this.connectionAttempts);

    this.Start();
  }
}
