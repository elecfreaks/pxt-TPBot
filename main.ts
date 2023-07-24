/**
 * The intelligent programming car produced by ELECFREAKS Co.ltd
 */
//% weight=0 color=#32b9b9 icon="\uf1b9"
//% block="TPBot" 
namespace TPBot {
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
    

    function TPColor_write(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    function TPColor_read(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }
    function rgbtohsl(color_r: number, color_g: number, color_b: number): number {
        let Hue = 0
        // normalizes red-green-blue values  把RGB值转成【0，1】中数值。
        let R = color_r * 100 / 255;   //由于H25不支持浮点运算，放大100倍在计算，下面的运算也放大100倍
        let G = color_g * 100 / 255;
        let B = color_b * 100 / 255;

        let maxVal = Math.max(R, Math.max(G, B))//找出R,G和B中的最大值
        let minVal = Math.min(R, Math.min(G, B)) //找出R,G和B中的最小值

        let Delta = maxVal - minVal;  //△ = Max - Min

        /***********   计算Hue  **********/
        if (Delta < 0) {
            Hue = 0;
        }
        else if (maxVal == R && G >= B) //最大值为红色
        {
            Hue = (60 * ((G - B) * 100 / Delta)) / 100;  //放大100倍
        }
        else if (maxVal == R && G < B) {
            Hue = (60 * ((G - B) * 100 / Delta) + 360 * 100) / 100;
        }
        else if (maxVal == G) //最大值为绿色
        {
            Hue = (60 * ((B - R) * 100 / Delta) + 120 * 100) / 100;
        }
        else if (maxVal == B) {
            Hue = (60 * ((R - G) * 100 / Delta) + 240 * 100) / 100;
        }
        return Hue
    }
    function InitTPBotColor(): void {
        TPColor_write(TPbotColor_ADDR, TPbotColor_ATIME, 252) // default inte time 4x2.78ms
        TPColor_write(TPbotColor_ADDR, TPbotColor_CONTROL, 0x03) // todo: make gain adjustable
        TPColor_write(TPbotColor_ADDR, TPbotColor_ENABLE, 0x00) // put everything off
        TPColor_write(TPbotColor_ADDR, TPbotColor_GCONF4, 0x00) // disable gesture mode
        TPColor_write(TPbotColor_ADDR, TPbotColor_AICLEAR, 0x00) // clear all interrupt
        TPColor_write(TPbotColor_ADDR, TPbotColor_ENABLE, 0x01) // clear all interrupt
        TPbotColor_init = true
    }
    function TPbotColorMode(): void {
        let tmp = TPColor_read(TPbotColor_ADDR, TPbotColor_ENABLE) | 0x2;
        TPColor_write(TPbotColor_ADDR, TPbotColor_ENABLE, tmp);
    }

    /**
     * Set the speed of left and right wheels. 
     * @param lspeed Left wheel speed , eg: 100
     * @param rspeed Right wheel speed, eg: -100
     */
    //% weight=99
    //% block="Set left wheel speed at %lspeed\\%| right wheel speed at %rspeed\\%"
    //% lspeed.min=-100 lspeed.max=100
    //% rspeed.min=-100 rspeed.max=100
    export function setWheels(lspeed: number = 50, rspeed: number = 50): void {
        if (lspeed > 100) {
            lspeed = 100;
        } else if (lspeed < -100) {
            lspeed = -100;
        }
        if (rspeed > 100) {
            rspeed = 100;
        } else if (rspeed < -100) {
            rspeed = -100;
        }
        Buff[0] = 0x01;    //控制位 0x01电机
        Buff[1] = lspeed;
        Buff[2] = rspeed;
        Buff[3] = 0x00;        //正反转加权值
        if (lspeed < 0 && rspeed < 0) {
            Buff[1] = lspeed * -1;
            Buff[2] = rspeed * -1;
            Buff[3] = 0x03;          //正反转加权值
        }
        else {
            if (lspeed < 0) {
                Buff[1] = lspeed * -1;
                Buff[2] = rspeed;
                Buff[3] = 0x01;
            }
            if (rspeed < 0) {
                Buff[1] = lspeed;
                Buff[2] = rspeed * -1;
                Buff[3] = 0x02;
            }
        }
        pins.i2cWriteBuffer(TPBotAdd, Buff);
    }
    /**
    * Setting the direction and time of travel.
    * @param direc Left wheel speed , eg: DriveDirection.Forward
    * @param speed Travel time, eg: 100
    */
    //% weight=95
    //% block="Go %direc at speed %speed\\% for %time seconds"
    //% speed.min=0 speed.max=100
    //% direc.fieldEditor="gridpicker" direc.fieldOptions.columns=2
    export function setTravelTime(direc: DriveDirection, speed: number, time: number): void {
        if (direc == 0) {
            setWheels(speed, speed)
            basic.pause(time * 1000)
            stopCar()
        }
        if (direc == 1) {
            setWheels(-speed, -speed)
            basic.pause(time * 1000)
            stopCar()
        }
        if (direc == 2) {
            setWheels(-speed, speed)
            basic.pause(time * 1000)
            stopCar()
        }
        if (direc == 3) {
            setWheels(speed, -speed)
            basic.pause(time * 1000)
            stopCar()
        }
    }
    /**
    * Setting the direction and speed of travel.
    * @param direc Left wheel speed , eg: DriveDirection.Forward
    * @param speed Travel time, eg: 100
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
     * @param side Line sensor edge , eg: LineState.Left
     * @param state Line sensor status, eg: LineSide.FindLine
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
    * @param state Four states of tracking module, eg: TrackingState.L_R_line
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
    * @param Sonarunit two states of ultrasonic module, eg: SonarUnit.Centimeters
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
    * @param dis sonar distance , eg: 5
    * @param judge state, eg: Sonarjudge.<
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
    * @param r R color value of RGB color, eg: 83
    * @param g G color value of RGB color, eg: 202
    * @param b B color value of RGB color, eg: 236
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
     * @param servo ServoList, eg: ServoList.S1
     * @param angle angle of servo, eg: 90
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
    * @param servo ServoList, eg: ServoList.S1
    * @param speed speed of servo, eg: 100
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
     * @param servo ServoList, eg: ServoList.S1
     * @param angle angle of servo, eg: 0
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
 /*

    //% blockId=TPbotColor_readcolor block="TPbot bottom Color sensor HUE(0~360)"
    //% subcategory=EDU
    export function TPBotReadColor(): number {
        Buff[0] = 0x31;
        pins.i2cWriteBuffer(TPBotAdd, Buff);
        if (TPbotColor_init == false) {
            InitTPBotColor()
            TPbotColorMode()
        }
        let tmp = TPColor_read(TPbotColor_ADDR, TPbotColor_STATUS) & 0x1;
        while (!tmp) {
            basic.pause(5);
            tmp = TPColor_read(TPbotColor_ADDR, TPbotColor_STATUS) & 0x1;
        }
        let c = TPColor_read(TPbotColor_ADDR, TPbotColor_CDATAL) + TPColor_read(TPbotColor_ADDR, TPbotColor_CDATAH) * 256;
        let r = TPColor_read(TPbotColor_ADDR, TPbotColor_RDATAL) + TPColor_read(TPbotColor_ADDR, TPbotColor_RDATAH) * 256;
        let g = TPColor_read(TPbotColor_ADDR, TPbotColor_GDATAL) + TPColor_read(TPbotColor_ADDR, TPbotColor_GDATAH) * 256;
        let b = TPColor_read(TPbotColor_ADDR, TPbotColor_BDATAL) + TPColor_read(TPbotColor_ADDR, TPbotColor_BDATAH) * 256;
        // map to rgb based on clear channel
        let avg = c / 3;
        r = r * 255 / avg;
        g = g * 255 / avg;
        b = b * 255 / avg;
        //let hue = rgb2hue(r, g, b);
        let hue = rgbtohsl(r, g, b)
        return hue
    }
    //% block="TPbot bottom Color sensor detects %color"
    //% subcategory=EDU
    //% color.fieldEditor="gridpicker" color.fieldOptions.columns=3
    export function TPBotCheckColor(color: TPBotColorList): boolean {
        let hue = TPBotReadColor()
        switch (color) {
            case TPBotColorList.red:
                if (hue > 330 || hue < 20) {
                    return true
                }
                else {
                    return false
                }
                break
            case TPBotColorList.green:
                if (hue > 110 && 150 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case TPBotColorList.blue:
                if (hue > 200 && 270 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case TPBotColorList.cyan:
                if (hue > 160 && 180 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case TPBotColorList.magenta:
                if (hue > 260 && 330 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case TPBotColorList.yellow:
                if (hue > 30 && 90 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case TPBotColorList.white:
                if (hue >= 180 && 200 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
        }
    }

    //% block="TPbot %CMD Melody %Melody"
    //% subcategory=EDU
    //% CMD.fieldEditor="gridpicker" CMD.fieldOptions.columns=2
    //% Melody.fieldEditor="gridpicker" Melody.fieldOptions.columns=2
    export function TPBotMelody(CMD: MelodyCMDList, Melody: MelodyList): void {
        Buff[0] = 0x30;
        Buff[1] = CMD;
        Buff[2] = 0;
        Buff[3] = Melody;
        if(CMD == MelodyCMDList.Stop){
        Buff[2] = 0;
        Buff[3] = 0;
        }
        pins.i2cWriteBuffer(TPBotAdd, Buff);
    }
     */   
}
