import io from 'socket.io-client';

let socket = io('http://localhost:3000/');

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