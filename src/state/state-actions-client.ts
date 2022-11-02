import * as signalR from '@aspnet/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

//  TODO:  Need to manage reconnection to hub scenarios here

export class StateEventArgs {
  public State: any;

  public StateKey!: string;

  public StateType!: string;
}

export class StateRequest {
  public StateKey!: string;

  public StateType!: string;
}

export class StateUpdateRequest<TState> extends StateRequest {
  public State!: TState;
}

export abstract class StateActionsClient {
  //  Fields
  protected attachedStates!: { [stateLookup: string]: Set<string> };

  protected retryCount: number;

  protected started: BehaviorSubject<boolean>;

  protected state: BehaviorSubject<StateEventArgs | null>;

  //  Properties
  public Hub?: signalR.HubConnection;

  public Started!: Observable<boolean>;

  public State!: Observable<StateEventArgs | null>;

  public Transport: signalR.HttpTransportType;

  public URL: string;

  //  Constructors
  constructor(url: string, transport: signalR.HttpTransportType) {
    this.attachedStates = {};

    this.retryCount = 0;

    this.started = new BehaviorSubject(false);

    this.state = new BehaviorSubject<StateEventArgs | null>(null);

    this.Started = this.started.asObservable();

    this.State = this.state.asObservable();

    this.Transport = transport;

    this.URL = url;
  }

  //  API Methods
  public async Start(): Promise<void> {
    try {
      //  TODO:  Retry logic here

      if (this.Hub === undefined) {
        this.Hub = this.connect();

        this.Hub.serverTimeoutInMilliseconds = 600000;

        this.Hub.onclose(this.onClosed);

        this.registerStateHandlers();
      }

      await this.Hub?.start();

      this.started.next(true);
    } catch (ex: any) {
      this.Hub = undefined;

      this.handleStartError(ex);
    }
  }

  public async Stop(): Promise<void> {
    await this.Hub!.stop();
  }

  public async AttachState(stateType: string, stateKey: string): Promise<void> {
    this.registerStateHandler(stateType, stateKey);

    await this.Hub!.invoke('AttachState', stateType, stateKey);
  }

  public UnattachState(stateType: string, stateKey: string): Promise<void> {
    this.unregisterStateHandler(stateType, stateKey);

    return this.Hub!.invoke('UnattachState', stateType, stateKey);
  }

  //  Helpers
  protected connect(): signalR.HubConnection {
    var bldr = this.createHubBuilder();

    return bldr.build();
  }

  protected createHubBuilder() {
    return new signalR.HubConnectionBuilder().withUrl(this.URL, {
      transport: this.Transport,
    });
    // .WithAutomaticReconnect();  // TODO:  Reconnect logic will have to be manually implemented
  }

  protected handleStartError(ex: any): void {}

  protected onClosed(err: Error | undefined) {}

  protected registerStateHandler(stateType: string, stateKey: string): void {
    var stateLookup = `${stateType}|${stateKey}`;

    this.unregisterStateHandler(stateType, stateKey);

    this.Hub!.on(stateLookup, this.updateState);

    if (!this.attachedStates[stateType])
      this.attachedStates[stateType] = new Set<string>();

    this.attachedStates[stateType].add(stateKey);
  }

  protected registerStateHandlers(): void {
    const stateTypes = Object.keys(this.attachedStates);

    stateTypes.forEach((stateType) => {
      const stateKeys = this.attachedStates[stateType];

      stateKeys.forEach((stateKey) => {
        this.registerStateHandler(stateType, stateKey);
      });
    });
  }

  protected unregisterStateHandler(stateType: string, stateKey: string): void {
    var stateLookup = `${stateType}|${stateKey}`;

    this.Hub!.off(stateLookup);

    if (this.attachedStates[stateType])
      this.attachedStates[stateType].delete(stateKey);
  }

  protected updateState(request: StateUpdateRequest<any>): void {
    this.state.next({
      State: request.State,
      StateType: request.StateType,
      StateKey: request.StateKey,
    });
  }
}
