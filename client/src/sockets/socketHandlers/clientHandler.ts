import { Emitter, type DefaultEventsMap } from '@socket.io/component-emitter';
import type { SocketEventName } from '@solaris-common';
import { Socket } from 'socket.io-client';
import type { Store } from 'vuex/types/index.js';
import GameHelper from '../../services/gameHelper';
import type { State } from '../../store';
import type { PlayerClientSocketEmitter } from '../socketEmitters/player';
import ClientSocketEventNames, { type ClientSocketEventType } from "../socketEventNames/client";

export class ClientHandler {

  constructor(socket: Socket,
              store: Store<State>,
              playerClientSocketEmitter: PlayerClientSocketEmitter) {

    this.socketOn(socket, ClientSocketEventNames.Connect, async () => {
      console.log('Socket connection established.');
    });

    this.socketOn(socket.io, ClientSocketEventNames.Error, (err: Error) => {
      console.error('Socket.io error.');
      console.error(err);
    });

    this.socketOn(socket.io, ClientSocketEventNames.Reconnect, (attemptCount: number) => {
      let gameId = store.state.game?._id;

      if (gameId != null) {
        let player = GameHelper.getUserPlayer(store.state.game)

        console.log('Rejoining game room.');

        playerClientSocketEmitter.emitGameRoomJoined({
          gameId: gameId,
          playerId: player?._id
        });
      }
    });
  }

  protected socketOn<TSocketEventName extends SocketEventName<ClientSocketEventType, TData>, TData extends unknown>(emitter: Emitter<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, event: TSocketEventName, listener: (e: TData) => void): void {
    emitter.on(event as string, listener);
  }
}
