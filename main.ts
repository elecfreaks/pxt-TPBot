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

const TPBotAdd = 0X10
let Buff = pins.createBuffer(4);
let _initEvents = true

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
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
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
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.setTravelSpeed(direc, speed);
        }
    }
    /**
    * Stop the car. 
    */
    //% weight=80
    //% block="Stop the car immediately"
    export function stopCar(): void {
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.stopCar();
        }
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
    export function trackSide(side: LineSide, State: LineState): boolean {
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.trackSide(side,State);
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
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.trackLine(state);
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
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.trackEvent(side,state,handler);
        }
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
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.sonarReturn(unit,maxCmDistance);
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
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.sonarJudge(judge,dis);
        }
    }
    /**
    * Select a color to Set eye mask lamp.
    */
    //% block="Set headlight color to $color"
    //% weight=30
    //% color.shadow="colorNumberPicker"
    export function headlightColor(color: number) {
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.headlightColor(color);
        }
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
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.headlightRGB(r, g, b);
        }
    }
    /**
    * Turn off the eye mask lamp.
    */
    //% block="Turn off the headlights"
    //% weight=20
    export function headlightClose(): void {
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.headlightClose();
        }
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
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.setServo360(servo, speed);
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
        if (readHardVersion() == 2) {
            //TODO TPBotV1.setTravelTime(lspeed, rspeed);
        } else {
            TPBotV1.setServo(servoType, servo, angle);
        }
    }

    /***********************************************************************************************
     * PID控制
     ***********************************************************************************************/

    export enum SpeedUnit {
        //%block="cm/s"
        Cm_s,
        //%block="inch/s"
        Inch_s
    }
    export enum Direction {
        //%block="Forward"
        Forward,
        //%block="Backward"
        Backward
    }
    export enum DistanceUnit {
        //%block="cm"
        Cm,
        //%block="inch"
        Inch
    }
    export enum Wheel {
        //%block="WheelLeft"
        WheelLeft = 0,
        //%block="WheelRight"
        WheelRight = 1,
        //%block="WheelALL"
        WheelALL = 2
    }
    export enum AngleUnits {
        //%block="Angle"
        Angle,
        //%block="Circle"
        Circle
    }
    export enum TurnUnit {
        //%block="Leftsteering"
        Leftsteering = 0,
        //%block="Rightsteering"
        Rightsteering = 1,
        //%block="Stay_Leftsteering"
        Stay_Leftsteering = 2,
        //%block="Stay_Rightsteering"
        Stay_Rightsteering = 3
    }
    export enum TurnAngleUnit {
        //% block="45°"
        T45 = 45,
        //% block="90°"
        T90 = 90,
        //% block="135°"
        T135 = 135,
        //% block="180°"
        T180 = 180
    }

    //
    /**
     * control the car to travel at a specific speed (speed.min=20cm/s speed.max=50cm/s)
     * @lspeed set the lspeed
     * @rspeed set the rspeed
     * @unit set the SpeedUnit
     */
    //% subcategory="PID"
    //% block="set left wheel speed %lspeed, right wheel speed %rspeed %unit"
    //% weight=210
    export function pidSpeedControl(lspeed: number, rspeed: number, unit: SpeedUnit): void {
        TPBotV2.pidSpeedControl(lspeed, rspeed, unit);
    }

    /**
     * set the car to travel a specific distance(distance.max=6000cm, distance.min=0cm)
     * @Direction set the direction eg: Direction.Forward
     * @distance set the distance eg: 0
     * @DistanceUnit set the DistanceUnit eg: DistanceUnit.Cm
     */
    //% subcategory="PID"
    //% weight=200
    //% block="go %Direction %distance %DistanceUnit"
    export function pidRunDistance(direction: Direction, distance: number, unit: DistanceUnit): void {
        TPBotV2.pidRunDistance(direction, distance, unit);
    }

    /**
     * Select the wheel and set the Angle or number of turns you want to turn
     * @Wheel Select wheel eg: Wheel.WheelLeft
     * @angle set the angle or number of turns eg: 0
     * @angleUnits set the angle unit eg: AngleUnit.angle
     */
    //% subcategory="PID"
    //% weight=200
    //% block="set %Wheel rotation %angle %AngleUnits"
    export function pidRunAngle(wheel: Wheel, angle: number, angleUnits: AngleUnits): void {
        TPBotV2.pidRunAngle(wheel, angle, angleUnits);
    }

    /**
    * set block length
    * @length set the length of each block eg: 0
    * @DistanceUnit set the DistanceUnit eg: DistanceUnit.Cm
    */
    //% subcategory="PID"
    //% weight=180
    //% block="set length of the squares as %length %DistanceUnit"
    export function pidBlockSet(length: number, distanceUnit: DistanceUnit): void {
        TPBotV2.pidBlockSet(length, distanceUnit);
    }

    /**
    * run a specific number of block
    * @cnt set the number of block eg: 0
    */
    //% subcategory="PID"
    //% weight=170
    //% block="go forward %cnt squares"
    export function pidRunBlock(cnt: number): void {
        TPBotV2.pidRunBlock(cnt);
    }


    /**
     * set the trolley to rotate at a specific Angle
     * @TurnUnit set the rotation mode eg: TurnUnit.Leftsteering
     * @TurnAngleUnit set the angle unit eg: TurnAngleUnit.T45
     */
    //% subcategory="PID"
    //% weight=190
    //% block="set car %TurnUnit for angle %TurnAngleUnit"
    export function pidRunSteering(turn: TurnUnit, angle: TurnAngleUnit): void {
        TPBotV2.pidRunSteering(turn, angle);
    }

    let version = -1;
    export function readHardVersion(): number {
        // if (version == -1) {
            
        //     let i2cBuffer = pins.createBuffer(7);
        //     i2cBuffer[0] = 0x99;
        //     i2cBuffer[1] = 0x15;
        //     i2cBuffer[2] = 0x01;
        //     i2cBuffer[3] = 0x00;
        //     i2cBuffer[4] = 0x00;
        //     i2cBuffer[5] = 0x00;
        //     i2cBuffer[6] = 0x88;
        //     pins.i2cWriteBuffer(0x10, i2cBuffer)
        //     //cutebotProV2.i2cCommandSend(0xA0, [0x00])
        //     version = pins.i2cReadNumber(0x10, NumberFormat.UInt8LE, false);
        //     if (version != 1) {
        //         version = 2;
        //     }
        // }
        // return version;
        return 2;
    }
}
