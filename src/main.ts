import readLine from 'readline';
import { createSewParser } from 'sew-parser';
import SerialPort from 'serialport';
import { SewCar } from './sewcar';
import {
    ForwardCommand,
    BackwardCommand,
    StopCommand,
    LeftCommand,
    RightCommand
} from './sewcar-commands';

const FORWARD_KEY = 'w';
const BACKWARD_KEY = 's';
const TURNRIGHT_KEY = 'd';
const TURNLEFT_KEY = 'a';
const STOP_KEY = 'p';

function handleKeywordActions(conn: SerialPort) {
    function sendCommand(command: Buffer) {
        console.log('command', command);
        conn.write(command);
    }

    function processKey(key: string) {
        switch (key) {
            case FORWARD_KEY:
                sendCommand(ForwardCommand);
                break;
            case BACKWARD_KEY:
                sendCommand(BackwardCommand);
                break;
            case TURNLEFT_KEY:
                sendCommand(LeftCommand);
                break;
            case TURNRIGHT_KEY:
                sendCommand(RightCommand);
                break;
            case STOP_KEY:
                sendCommand(StopCommand);
                break;
            default:
                break;
        }
    }

    if (process.stdin.setRawMode) process.stdin.setRawMode(true);
    readLine.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            conn.close(() => {
                process.exit(0);
            });
        } else {
            processKey(key.name);
        }
    });
}

export const main = async () => {
    const parser = createSewParser(data => {
        console.log('SewCar>', data.sensorId, data.type, data.payload);
    });
    const sewCar = await SewCar(parser);
    handleKeywordActions(sewCar);
    process.on('SIGINT', () => {
        sewCar.close(() => {
            process.exit(0);
        });
    });
};

main();
