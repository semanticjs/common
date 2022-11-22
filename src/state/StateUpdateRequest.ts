import { StateRequest } from './StateRequest';

export class StateUpdateRequest<TState> extends StateRequest {
  public State!: TState;
}
