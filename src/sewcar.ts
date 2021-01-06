import SerialPort from 'serialport';

export const getSewCarPort = async (vendor = '1a86', product = '7523') => {
    try {
        const ports = await SerialPort.list();
        return ports.filter(port => {
            console.log('Port', port.path, port.vendorId, port.productId);
            if (port.vendorId === vendor && port.productId === product) {
                return true;
            }
            return false;
        });
    } catch (error) {
        console.log('Finding SewCar fails', error);
        return null;
    }
};

export const startListenSewCar = (
    path = '/dev/tty.usbserial-1411310',
    parser: SewCarParser
): Promise<SerialPort> => {
    return new Promise((resolve, reject) => {
        const port = new SerialPort(
            path,
            {
                baudRate: 115200,
                stopBits: 1,
                parity: 'none'
            },
            error => {
                if (!error) {
                    console.log('Port connected', path, error);
                    port.on('open', error => console.log('Open port', error));
                    port.on('error', error =>
                        console.log('Error data:', error)
                    );
                    port.once('data', (data: Buffer) => {
                        if (data.equals(Buffer.from([0x53, 0x45, 0x57]))) {
                            // Send MAC
                            setTimeout(() => {
                                const macBuffer = Buffer.from([
                                    0x01,
                                    0x02,
                                    0x03,
                                    0x04,
                                    0x05,
                                    0x06
                                ]);
                                port.write(macBuffer);
                                port.on('data', parser);
                                resolve(port);
                            });
                        }
                    });
                    port.on('close', error =>
                        console.log('Closing port', path, error)
                    );
                } else {
                    console.log('Error opening', path, error);
                    reject(error);
                }
            }
        );
    });
};

export type SewCarParser = (frame: Buffer) => void;
export async function SewCar(parser: SewCarParser) {
    const sewCarInfo = await getSewCarPort();
    if (!Array.isArray(sewCarInfo) || sewCarInfo.length < 1) {
        console.log('No SewCars found!');
        return Promise.reject(new Error('SewCar not found'));
    }
    console.log('SewCar Info', sewCarInfo);
    return await startListenSewCar(sewCarInfo[0].path, parser);
}
