import io from 'socket.io-client';
import Socket from './../components/Socket';

let socket = Socket;

export const emitAction = (actionCreator) => {
    return (...args) => {
        const result = actionCreator.apply(this.args)
        socket.emit(result.key, {
            ...result.payload,
            type: result.type
        })
        return result
    }
}