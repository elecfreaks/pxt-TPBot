const TPBotAdd = 0X10
let Buff = pins.createBuffer(4);
let _initEvents = true
/**
* List of driving directions
*/
export enum DriveDirection {
    //% block="Forward"
    Forward = 0,
    //% block="Backward"
    Backward = 1,
    //% block="Left"
    Left = 2,
    //% block="Right"
    Right = 3
}
/**
* Status List of Tracking Modules
*/
export enum TrackingState {
    //% block="● ●" enumval=0
    L_R_line,

    //% block="◌ ●" enumval=1
    L_unline_R_line,

    //% block="● ◌" enumval=2
    L_line_R_unline,

    //% block="◌ ◌" enumval=3
    L_R_unline
}
/**
* Unit of Ultrasound Module
*/
export enum SonarUnit {
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches
}
/**
* Ultrasonic judgment
*/
export enum Sonarjudge {
    //% block="<"
    Less,
    //% block=">"
    Greater
}
/**
* Select the servo on the S1 or S2
*/
export enum ServoList {
    //% block="S1"
    S1 = 0,
    //% block="S2"
    S2 = 1,
    //% block="S3"
    S3 = 2,
    //% block="S4"
    S4 = 3
}
/**
* Line Sensor states  
*/
export enum LineState{
    //% block="Black" enumval=0
    Black,
    //% block="White"enumval=1
    White
}
/**
* Line Sensor Side
*/
export enum LineSide{
    //% block="Left" enumval=0
    Left,
    //% block="Right" enumval=1
    Right
}
/**
 * Line Sensor events  
 */
export enum MbEvents {
    //% block="Black"
    Black = DAL.MICROBIT_PIN_EVT_FALL,
    //% block="White"
    White = DAL.MICROBIT_PIN_EVT_RISE
}
/**
 * Pins used to generate events
 */
export enum MbPins {
    //% block="Left"
    Left = DAL.MICROBIT_ID_IO_P13,
    //% block="Right"
    Right = DAL.MICROBIT_ID_IO_P14
}
export enum MelodyCMDList {
    //% block="Play"
    Play = 0x03,
    //% block="Stop"
    Stop = 0x16

}
export enum MelodyList {
    //% block="Happy"
    Happy = 0x01

}
/////////////////////////color/////////////////////////
export enum TPBotColorList {
    //% block="Red"
    red,
    //% block="Green"
    green,
    //% block="Blue"
    blue,
    //% block="Cyan"
    cyan,
    //% block="Magenta"
    magenta,
    //% block="Yellow"
    yellow,
    //% block="White"
    white
}

/**
* Set the steering gear to 180 or 360
*/
export enum ServoTypeList {
    //% block="180°"
    S180 = 0,
    //% block="360°"
    S360 = 1
}

const TPbotColor_ADDR = 0x39
const TPbotColor_ENABLE = 0x80
const TPbotColor_ATIME = 0x81
const TPbotColor_CONTROL = 0x8F
const TPbotColor_STATUS = 0x93
const TPbotColor_CDATAL = 0x94
const TPbotColor_CDATAH = 0x95
const TPbotColor_RDATAL = 0x96
const TPbotColor_RDATAH = 0x97
const TPbotColor_GDATAL = 0x98
const TPbotColor_GDATAH = 0x99
const TPbotColor_BDATAL = 0x9A
const TPbotColor_BDATAH = 0x9B
const TPbotColor_GCONF4 = 0xAB
const TPbotColor_AICLEAR = 0xE7
let TPbotColor_init = false

/**
 * The intelligent programming car produced by ELECFREAKS Co.ltd
 */
//% weight=0 color=#32b9b9 icon="\uf1b9"
//% block="TPBot" 
namespace TPBot { 

    /**
     * Set the speed of left and right wheels. 
     * @param lspeed Left wheel speed
     * @param rspeed Right wheel speed
     */
    //% weight=99
    //% block="Set left wheel speed at %lspeed\\%| right wheel speed at %rspeed\\%"
    //% lspeed.min=-100 lspeed.max=100
    //% rspeed.min=-100 rspeed.max=100
    export function setWheels(lspeed: number = 50, rspeed: number = 50): void {
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setWheels(lspeed, rspeed);
        } else {
            TPBotV1.setWheels(lspeed, rspeed);
        }
    }
    /**
    * Setting the direction and time of travel.
    * @param direc Left wheel speed 
    * @param speed Travel time
    */
    //% weight=95
    //% block="Go %direc at speed %speed\\% for %time seconds"
    //% speed.min=0 speed.max=100
    //% direc.fieldEditor="gridpicker" direc.fieldOptions.columns=2
    export function setTravelTime(direc: DriveDirection, speed: number, time: number): void {
        if (readHardVersion() == 2) {
            TPBotV1.setTravelTime(direc, speed,time);
        } else {
            TPBotV1.setTravelTime(direc, speed,time);
        }
    }
    /**
    * Setting the direction and speed of travel.
    * @param direc Left wheel speed
    * @param speed Travel time
    */
    //% weight=90
    //% block="Go %direc at speed %speed\\%"
    //% speed.min=0 speed.max=100
    //% direc.fieldEditor="gridpicker" direc.fieldOptions.columns=2
    export function setTravelSpeed(direc: DriveDirection, speed: number): void {
        if (direc == 0) {
            setWheels(speed, speed)
        }
        if (direc == 1) {
            setWheels(-speed, -speed)
        }
        if (direc == 2) {
            setWheels(-speed, speed)
        }
        if (direc == 3) {
            setWheels(speed, -speed)
        }
    }
    /**
    * Stop the car. 
    */
    //% weight=80
    //% block="Stop the car immediately"
    export function stopCar(): void {
        Buff[0] = 0x01;     //控制位 0x01电机
        Buff[1] = 0;		//左轮速度
        Buff[2] = 0;        //右轮速度
        Buff[3] = 0;        //正反转加权值
        pins.i2cWriteBuffer(TPBotAdd, Buff);  //传递数据
    }
    /**
     * track one side
     * @param side Line sensor edge 
     * @param state Line sensor status
     */
    //% weight=70
    //% block="%side line sensor detected %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    export function trackSide(side: LineSide, state: LineState): boolean {
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        let left_tracking = pins.digitalReadPin(DigitalPin.P13);
        let right_tracking = pins.digitalReadPin(DigitalPin.P14);
        if (side == 0 && state == 1 && left_tracking == 1) {
            return true;
        }
        else if (side == 0 && state == 0 && left_tracking == 0) {
            return true;
        }
        else if (side == 1 && state == 1 && right_tracking == 1) {
            return true;
        }
        else if (side == 1 && state == 0 && right_tracking == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
    * Judging the Current Status of Tracking Module.
    * @param state Four states of tracking module
    */
    //% weight=60
    //% block="Line sensor state is %state"
    //% state.fieldEditor="gridpicker"
    //% state.fieldOptions.columns=1
    export function trackLine(state: TrackingState): boolean {
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        let left_tracking = pins.digitalReadPin(DigitalPin.P13);
        let right_tracking = pins.digitalReadPin(DigitalPin.P14);
        if (left_tracking == 0 && right_tracking == 0 && state == 0) {
            return true;
        }
        else if (left_tracking == 1 && right_tracking == 0 && state == 1) {
            return true;
        }
        else if (left_tracking == 0 && right_tracking == 1 && state == 2) {
            return true;
        }
        else if (left_tracking == 1 && right_tracking == 1 && state == 3) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
    * Runs when line sensor finds or loses.
    */
    //% weight=50
    //% block="On %side| line sensor detected %state"
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    export function trackEvent(side: MbPins, state: MbEvents, handler: Action) {
        initEvents();
        control.onEvent(<number>side, <number>state, handler);
        basic.pause(5);
    }
    /**
    * Cars can extend the ultrasonic function to prevent collisions and other functions.
    * @param Sonarunit two states of ultrasonic module
    */
    //% weight=40
    //% block="Sonar distance unit %unit"
    //% unit.fieldEditor="gridpicker"
    //% unit.fieldOptions.columns=2
    export function sonarReturn(unit: SonarUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(DigitalPin.P16, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P16, 0);
        control.waitMicros(2);
        pins.digitalWritePin(DigitalPin.P16, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P16, 0);

        // read pulse
        const d = pins.pulseIn(DigitalPin.P15, PulseValue.High, maxCmDistance * 58);
        /*let d = 0
        while (1) {
            control.waitMicros(1)
            if (pins.digitalReadPin(DigitalPin.P15) == 1) {
                d = d + 1
                if (d == 25000)
                    break
            }
            else {
                break
            }
        }*/

        switch (unit) {
            case SonarUnit.Centimeters:
                return Math.idiv(d, 58);
            case SonarUnit.Inches:
                return Math.idiv(d, 148);
            default:
                return d;
        }
    }
    /**
    * sonar Judge.
    * @param dis sonar distance 
    * @param judge state
    */
    //% weight=35
    //% block="Sonar distance %judge %dis cm"
    //% dis.min=1 dis.max=400
    //% judge.fieldEditor="gridpicker" judge.fieldOptions.columns=2
    export function sonarJudge(judge: Sonarjudge, dis: number): boolean {
        if (judge == 0) {
            if (sonarReturn(SonarUnit.Centimeters) < dis && sonarReturn(SonarUnit.Centimeters) != 0) {
                return true
            }
            else {
                return false
            }
        }
        else {
            if (sonarReturn(SonarUnit.Centimeters) > dis) {
                return true
            }
            else {
                return false
            }
        }
    }
    /**
    * Select a color to Set eye mask lamp.
    */
    //% block="Set headlight color to $color"
    //% weight=30
    //% color.shadow="colorNumberPicker"
    export function headlightColor(color: number) {
        let r, g, b: number = 0
        r = color >> 16
        g = (color >> 8) & 0xFF
        b = color & 0xFF
        headlightRGB(r, g, b)
    }

    /**
    * Set RGB color of eye mask lamp.
    * @param r R color value of RGB color
    * @param g G color value of RGB color
    * @param b B color value of RGB color
    */
    //% weight=25
    //% inlineInputMode=inline
    //% block="Set headlight color to R:%r G:%g B:%b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    export function headlightRGB(r: number, g: number, b: number): void {
        Buff[0] = 0x20;
        Buff[1] = r;
        Buff[2] = g;
        Buff[3] = b;
        pins.i2cWriteBuffer(TPBotAdd, Buff);
    }
    /**
    * Turn off the eye mask lamp.
    */
    //% block="Turn off the headlights"
    //% weight=20
    export function headlightClose(): void {
        headlightRGB(0, 0, 0)
    }

    /**
     * Set the angle of servo. 
     * @param servo ServoList
     * @param angle angle of servo
     */
    /*
    //% weight=15
    //% block="Set 180° servo %servo angle to %angle °"
    //% angle.shadow="protractorPicker"
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.columns=1
    export function setServo180(servo: ServoList, angle: number = 180): void {
        switch (servo) {
            case 0:
                Buff[0] = 0x10;
                break;
            case 1:
                Buff[0] = 0x11;
                break;
            case 2:
                Buff[0] = 0x12;
                break;
            case 3:
                Buff[0] = 0x13;
                break;
        }
        Buff[1] = angle;
        Buff[2] = 0;
        Buff[3] = 0;
        pins.i2cWriteBuffer(TPBotAdd, Buff);
    }
    */
    /**
    * Set the speed of servo.
    * @param servo ServoList
    * @param speed speed of servo
    */
    //% weight=14
    //% block="Set 360° servo %servo speed to %speed \\%"
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.columns=1
    //% speed.min=-100 speed.max=100
    export function setServo360(servo: ServoList, speed: number = 100): void {
        speed = Math.map(speed, -100, 100, 0, 180)
        switch (servo) {
            case 0:
                Buff[0] = 0x10;
                break;
            case 1:
                Buff[0] = 0x11;
                break;
            case 2:
                Buff[0] = 0x12;
                break;
            case 3:
                Buff[0] = 0x13;
                break;
        }
        Buff[1] = speed;
        Buff[2] = 0;
        Buff[3] = 0;
        pins.i2cWriteBuffer(TPBotAdd, Buff);
    }
    function initEvents(): void {
        if (_initEvents) {
            pins.setEvents(DigitalPin.P13, PinEventType.Edge);
            pins.setEvents(DigitalPin.P14, PinEventType.Edge);
            _initEvents = false;
        }
    }
    /**
     * Set the angle of servo. 
     * @param servo ServoList
     * @param angle angle of servo
     */
    //% weight=15
    //% block="Set %ServoTypeList servo %servo angle to %angle °"
    export function setServo(servoType: ServoTypeList, servo: ServoList, angle: number = 0): void {
        switch (servo) {
            case 0:
                Buff[0] = 0x10;
                break;
            case 1:
                Buff[0] = 0x11;
                break;
            case 2:
                Buff[0] = 0x12;
                break;
            case 3:
                Buff[0] = 0x13;
                break;
        }
        switch (servoType) {
            case ServoTypeList.S180:
                angle = Math.map(angle, 0, 180, 0, 180)
                break
            case ServoTypeList.S360:
                angle = Math.map(angle, 0, 360, 0, 180)
                break
        }

        Buff[1] = angle;
        Buff[2] = 0;
        Buff[3] = 0;
        pins.i2cWriteBuffer(TPBotAdd, Buff);
    }

    let version = -1;
    export function readHardVersion(): number {
        if (version == -1) {
            
            let i2cBuffer = pins.createBuffer(7);
            i2cBuffer[0] = 0x99;
            i2cBuffer[1] = 0x15;
            i2cBuffer[2] = 0x01;
            i2cBuffer[3] = 0x00;
            i2cBuffer[4] = 0x00;
            i2cBuffer[5] = 0x00;
            i2cBuffer[6] = 0x88;
            pins.i2cWriteBuffer(0x10, i2cBuffer)
            //cutebotProV2.i2cCommandSend(0xA0, [0x00])
            version = pins.i2cReadNumber(0x10, NumberFormat.UInt8LE, false);
            if (version != 1) {
                version = 2;
            }
        }
        return version;
        // return 2;
    }
}
