// tests go here; this will not be compiled when this package is used as a library
let right = 0
let left = 0
basic.forever(function () {
    left = Math.randomRange(-100, 100)
    right = Math.randomRange(-100, 100)
    TPBot.setWheels(left, right)
    basic.pause(1000)
})
