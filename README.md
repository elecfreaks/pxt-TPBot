![](https://img.shields.io/badge/Plantfrom-Micro%3Abit-red) ![](https://img.shields.io/travis/com/elecfreaks/pxt-tpbot) ![](https://img.shields.io/github/v/release/elecfreaks/pxt-tpbot) ![](https://img.shields.io/github/last-commit/elecfreaks/pxt-tpbot) ![](https://img.shields.io/github/languages/top/elecfreaks/pxt-tpbot) ![](https://img.shields.io/github/issues/elecfreaks/pxt-tpbot) ![](https://img.shields.io/github/license/elecfreaks/pxt-tpbot) 

# TPBot Package

![](/images.png/)

This extension is designed to programme and drive the TPBot, You can [get TPBot from the Elecfreaks store](https://shop.elecfreaks.com/products/elecfreaks-micro-bit-tpbot-car-kit-without-micro-bit-board?_pos=1&_sid=ed3dd36cf&_ss=r&variant=40604208529487)

## Code Example
```JavaScript

let right = 0
let left = 0
TPBot.headlightColor(0xff0000)
basic.forever(function () {
    left = Math.randomRange(-100, 100)
    right = Math.randomRange(-100, 100)
    TPBot.setWheels(left, right)
    basic.pause(1000)
})

```
## Supported targets
for PXT/microbit

## License
MIT

