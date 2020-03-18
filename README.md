![](https://img.shields.io/badge/Plantfrom-Micro%3Abit-red) ![](https://img.shields.io/travis/com/lionyhw/pxt-tpbot) ![](https://img.shields.io/github/v/release/lionyhw/pxt-tpbot) ![](https://img.shields.io/github/last-commit/lionyhw/pxt-tpbot) ![](https://img.shields.io/github/languages/top/lionyhw/pxt-tpbot)  ![](https://img.shields.io/github/issues/lionyhw/pxt-tpbot) 

# TPBot Package

![](/image.png/)

This library is designed to drive TPBot, You can get TPBot here.

[https://www.elecfreaks.com/store](https://www.elecfreaks.com/store)

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

