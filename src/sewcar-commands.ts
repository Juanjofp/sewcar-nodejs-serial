import { createSewFrames, DCMotor } from 'sew-parser';

export const MotorLeft = '01:02:03:04:05:06:00:01';
export const MotorRight = '01:02:03:04:05:06:00:02';

export const createCommand = (
    motorId: string,
    enabled: boolean = false,
    reverse: boolean = false,
    velocity: number = 0
): DCMotor => ({
    sensorId: motorId,
    type: 'DCMOTOR',
    payload: { enabled, reverse, velocity }
});

export const StopCommand = createSewFrames([
    createCommand(MotorLeft),
    createCommand(MotorRight)
]);
export const ForwardCommand = createSewFrames([
    createCommand(MotorLeft, true, false, 250),
    createCommand(MotorRight, true, false, 250)
]);
export const BackwardCommand = createSewFrames([
    createCommand(MotorLeft, true, true, 250),
    createCommand(MotorRight, true, true, 250)
]);

export const LeftCommand = createSewFrames([
    createCommand(MotorLeft, true, true, 200),
    createCommand(MotorRight, true, true, 250)
]);
export const RightCommand = createSewFrames([
    createCommand(MotorLeft, true, true, 250),
    createCommand(MotorRight, true, true, 200)
]);
