//var xoff1 = 0
//var xoff2 = 10000
var inc = 0.01
let str_x
let str_y
let str_z
var xoff = 0
var yoff = 0
var zoff = 0
var zoffCir = 0
let phase
let slider

function setup() {
    createCanvas(600, 600)
    slider = createSlider(0, 10, 5, 0.1)
}

function draw() {
    background(0, 10)


    str_x = map(noise(xoff), 0, 1, 0, 255)
    str_y = map(noise(yoff), 0, 1, 0, 255)
    str_z = map(noise(zoff), 0, 1, 0, 255)


    translate(width / 2, height / 2)
    //stroke(255)
    stroke(str_x, str_y, str_z)
    strokeWeight(2)
    noFill()
    beginShape()
    let noiseMax = slider.value()

    for (let a = 0; a < TWO_PI; a += 0.01) {
        let xoffCir = map(cos(a), -1, 1, 0, noiseMax)
        let yoffCir = map(sin(a), -1, 1, 0, noiseMax)
        let r = map(noise(xoffCir, yoffCir, zoffCir), 0, 1, 0, 400)
        let x = r * cos(a)
        let y = r * sin(a)
        vertex(x, y)
    }

    xoff += random(-0.1, 0.1)
    yoff += random(-0.1, 0.1)
    zoff += random(-0.1, 0.1)
    zoffCir += inc
    endShape(CLOSE)
}


/*function draw() {
    translate(width / 2, height / 2)
    noFill()
    beginShape()
    let noiseMax = slider.value()

    for (let a = 0; a < TWO_PI; a += 0.3) {
        let xoffset = map(cos(a + phase), -1, 1, 0, noiseMax)
        let yoffset = map(sin(a + phase), -1, 1, 0, noiseMax)
        let r = map(noise(xoffset, yoffset, zoffset), 0, 1, 100, 200)
        let x = r * cos(a)
        let y = r * sin(a)
        vertex(x, y)
    }

    endShape(CLOSE)
    zoffset += 0.01
    //phase += 0.01
}*/