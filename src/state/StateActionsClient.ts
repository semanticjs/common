import * as signalR from '@aspnet/signalr';
import { TypedEventEmitter } from '../api/TypedEventEmitter';
import { StateEventArgs } from './StateEventArgs';
import { StateUpdateRequest } from './StateUpdateRequest';

type StateActionsClientEvents = {
  closed: (err: any) => void;
  started: (started: boolean) => void;
  startError: (err: any) => void;
  state: (state: StateEventArgs) => void;
};

export abstract class StateActionsClient extends TypedEventEmitter<StateActionsClientEvents> {
  //  Fields
  protected attachedStates!: { [stateLookup: string]: Set<string> };

  protected retryCount: number;

  //  Properties
  public Hub?: signalR.HubConnection;

  public Transport: signalR.HttpTransportType;

  public URL: string;

  //  Constructors
  constructor(url: string, transport: signalR.HttpTransportType) {
    super();

    this.attachedStates = {};

    this.retryCount = 0;

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

        this.Hub.onclose((err) => this.onClosed(err));

        this.registerStateHandlers();
      }

      await this.Hub!.start();

      if (this.Hub) {
        this.emit('started', true);
      }
    } catch (ex: any) {
      this.Hub = undefined;

      this.handleStartError(ex);
    }
  }

  public async Stop(): Promise<void> {
    await this.Hub?.stop();
  }

  public async AttachState(stateType: string, stateKey: string): Promise<void> {
    this.registerStateHandler(stateType, stateKey);

    await this.Hub?.invoke('AttachState', stateType, stateKey);
  }

  public async UnattachState(
    stateType: string,
    stateKey: string
  ): Promise<void> {
    this.unregisterStateHandler(stateType, stateKey);

    await this.Hub?.invoke('UnattachState', stateType, stateKey);
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

  protected handleStartError(ex: any): void {
    this.emit('startError', ex);
  }

  protected onClosed(err: Error | undefined) {
    this.emit('closed', err);
  }

  protected registerStateHandler(stateType: string, stateKey: string): void {
    var stateLookup = `${stateType}|${stateKey}`;

    this.unregisterStateHandler(stateType, stateKey);

    console.log(`Registering state handler for ${stateLookup}.`);

    this.Hub?.on(stateLookup, (state) => {
      console.log(`Processing  state for handler ${stateLookup}.`);

      this.updateState(state);
    });

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

    this.Hub?.off(stateLookup);

    if (this.attachedStates[stateType])
      this.attachedStates[stateType].delete(stateKey);
  }

  protected updateState(request: StateUpdateRequest<any>): void {
    this.emit('state', {
      State: request.State,
      StateType: request.StateType,
      StateKey: request.StateKey,
    });
  }
}
