var OPTION_HEIGHT = 50
var OPTION_WIDTH = 200
var OPTION_BORDERS = 2

var menus = []

function setup() {
    createCanvas(windowWidth, windowHeight)
    var subSubOp1 = new Menu([], "Subsub Option 1", {
        r: 255,
        g: 200,
        b: 150
    })
    var subSubOp2 = new Menu([], "Subsub Option 2", {
        r: 255,
        g: 200,
        b: 150
    })
    var subSubOp3 = new Menu([], "Subsub Option 3", {
        r: 255,
        g: 200,
        b: 150
    })
    var subSubOp4 = new Menu([], "Subsub Option 4", {
        r: 255,
        g: 200,
        b: 150
    })
    var subOp1 = new Menu([subSubOp1, subSubOp2, subSubOp3, subSubOp4], "Sub Option 1", {
        r: 200,
        g: 255,
        b: 150
    })
    var op1 = new Menu([], "Option 1", {
        r: 150,
        g: 255,
        b: 200
    })
    var op2 = new Menu([subOp1], "Option 2", {
        r: 255,
        g: 150,
        b: 200
    })
    var op3 = new Menu([], "Option 3", {
        r: 200,
        g: 150,
        b: 255
    })
    var mainMenu = new Menu([op1, op2, op3], "Main Menu", {
        r: 150,
        g: 200,
        b: 255
    })
    mainMenu.hidden = false
    mainMenu.pos.x = 10
    mainMenu.pos.y = 10
    menus.push(mainMenu)
}

function draw() {
    background(51)

    for (var i = 0; i < menus.length; i++) {
        var menu = menus[i]
        menu.update()
        menu.render()
    }
}

function Menu(children, text, color) {
    this.instances.push(this)

    this.text = text
    this.children = children

    this.hidden = false
    this.open = false
    this.wasOpen = false

    this.pos = createVector()

    this.w = OPTION_WIDTH
    this.h = OPTION_HEIGHT

    this.c = color

    this.hl = 1.0
}
Menu.prototype.instances = []

Menu.prototype.update = function(parentX=null, parentY=null, idx=0) {
    if (this.hidden) return

    if (parentX != null) {
        this.pos.x = parentX + (OPTION_WIDTH) + OPTION_BORDERS
        this.pos.y = parentY + (OPTION_HEIGHT*idx) + (OPTION_BORDERS*idx)
    }

    // Update children
    for (var i = 0; i < this.children.length; i++) {
        var menu = this.children[i]
        menu.update(this.pos.x, this.pos.y, i)
        menu.hidden = !this.open
    }

    if (pointInRect(mouseX, mouseY, this.pos.x, this.pos.y, this.w, this.h)) {
        this.hl = 1.2
    } else {
        this.hl = 1.0
    }
}

Menu.prototype.render = function(idx=1) {
    if (this.hidden) return

    // Draw children
    for (var i = 0; i < this.children.length; i++) {
        var menu = this.children[i]
        menu.render()
    }
    
    // Draw self box
    strokeWeight(OPTION_BORDERS)
    stroke(this.c.r*0.5*this.hl, this.c.g*0.5*this.hl, this.c.b*0.5*this.hl)
    fill(this.c.r*0.2*this.hl, this.c.g*0.2*this.hl, this.c.b*0.2*this.hl)

    // if (this.open && !this.wasOpen) {
    //     this.pos.x += (OPTION_WIDTH*this.depth)
    //     this.pos.y += (OPTION_HEIGHT*idx)
    // }
    // if (!this.open && this.wasOpen) {
    //     this.pos.x -= (OPTION_WIDTH*this.depth)
    //     this.pos.y -= (OPTION_HEIGHT*idx)
    // }
    rect(this.pos.x, this.pos.y, this.w, this.h)

    // Draw self text
    noStroke()
    fill(this.c.r, this.c.g, this.c.b)
    textSize(24)
    text(this.text, this.pos.x + 6, this.pos.y + (OPTION_HEIGHT - 17))

    // // Draw children
    // for (var i = 0; i < this.children.length; i++) {
    //     var child = this.children[i]
    //     var yOff = this.pos.y + (OPTION_HEIGHT*(i+1))
        
    //     var r = child.c.r*child.hl
    //     var g = child.c.g*child.hl
    //     var b = child.c.b*child.hl

    //     if (child.open) {
    //         stroke(r, g, b)
    //     } else {
    //         noStroke()
    //     }

    //     // Option box
    //     fill(r*0.2, g*0.2, b*0.2)
    //     rect(this.pos.x, this.pos.y+yOff, this.w, OPTION_HEIGHT)
        
    //     // Option text
    //     noStroke()
    //     fill(r, g, b)
    //     textSize(24)
    //     text(child.text, this.pos.x + 6, this.pos.y + yOff + (OPTION_HEIGHT/2))
    // }
    
    // this.wasOpen = this.open
}

Menu.prototype.clicked = function(x, y) {
    // for (var i = 0; i < this.children.length; i++) {
    //     var menu = this.children[i]
    //     var oX = this.pos.x
    //     var oY = this.pos.y+(OPTION_HEIGHT*(i+1))
    //     menu.open = false
    //     if (pointInRect(x, y, oX, oY, OPTION_WIDTH, OPTION_HEIGHT)) {
    //         if (menu.wasOpen) {
    //             menu.open = false
    //         } else {
    //             menu.open = true
    //         }
    //     }
    // }
    this.open = !this.open
    if (!this.open) {
        for (var i = 0; i < this.children.length; i++) {
            var menu = this.children[i]
            menu.close()
        }
    }
    if (this.children.length) {
        console.log(this.text + (this.open ? " open": " close"))
    } else {
        console.log(this.text + " action")
    }
}

Menu.prototype.close = function() {
    this.open = false
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].close()
    }
}

function mousePressed() {
    var inst = Menu.prototype.instances
    for (var i = 0; i < inst.length; i++) {
        var menu = inst[i]
        if (!menu.hidden && pointInRect(mouseX, mouseY, menu.pos.x, menu.pos.y, menu.w, menu.h)) {
            menu.clicked(mouseX, mouseY)
            return
        }
    }
    if (menus[0].open) {
        menus[0].clicked()
    }
}

function pointInRect(x, y, rX, rY, w, h) {
    return (((x > rX) && (x < (rX+w))) && ((y > rY) && (y < rY+h)))
}