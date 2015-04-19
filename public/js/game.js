var WIDTH = 1000;
var HEIGHT = 600;
var ACC = 10;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "phaser-example", { preload: preload, create: create, update: update, render: render });
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function preload () {
    game.load.image("ship", "./img/ship.png");
    game.load.image("map", "./img/map.png");
    game.load.image("water", "./img/water.jpg");
    game.load.image("city", "./img/city.png");
    game.load.image("gameover", "./img/gameover.png");

    game.load.image("label-man", "./labels/manchester.png");
    game.load.image("label-nyc", "./labels/new_york.png");
    game.load.image("label-jon", "./labels/jon.png");
    game.load.image("label-mel", "./labels/melbourne.png");
    game.load.image("label-seo", "./labels/seoul.png");

    game.load.image("sup", "./img/spaceup.png")
    game.load.image("sdown", "./img/spacedown.png")
    game.load.audio("sfx", "./sounds/soundtrack.mp3");
    game.load.physics("colShip", "./img/data-ship.json");
    game.load.physics("colMap", "./img/data-map.json");
};

var water;
var ship;
var cursors;
var space;
var graphics;
var currentCity = {};
var allItemsPicked = false;
var itemsDelivered = false;
var gameOverSplash;
var fx;

var cities = [
    {
        name: "Manchester",
        x: 1160,
        y: 460,
        oilPrice: "244",
        labelFile: "label-man"
    },
    {
        name: "New York",
        x: 770,
        y: 580,
        oilPrice: "714",
        labelFile: "label-nyc",
        elementName: "leap",
        item: "Leap Motion",
        itemx: 20,
        itemy: 190
    },
    {
        name: "Johannesburgh",
        x: 1320,
        y: 990,
        oilPrice: "440",
        labelFile: "label-jon",
        elementName: "burgers",
        item: "Burgers",
        itemx: 150,
        itemy: 190
    },
    {
        name: "Melbourne",
        x: 1990,
        y: 1030,
        oilPrice: "312",
        labelFile: "label-mel",
        elementName: "oculus",
        item: "Oculus Rift",
        itemx: 20,
        itemy: 315
    },
    {
        name: "Seoul",
        x: 1900,
        y: 620,
        oilPrice: "562",
        labelFile: "label-seo",
        elementName: "kurt",
        item: "Kurt Lee",
        itemx: 150,
        itemy: 315
    }
];

function create () {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0;
    graphics = game.add.graphics(WIDTH, HEIGHT);

    setupWorld();
    setupShip();
    setupCities();

    gameOverSplash = game.add.sprite(1100, 550, "gameover");
    gameOverSplash.anchor.setTo(0.5, 0.5);
    gameOverSplash.kill();

    game.camera.follow(ship);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(1100, 550);

    fx = game.add.audio("sfx");
    fx.allowMultiple = true;
    fx.play();

    cursors = game.input.keyboard.createCursorKeys();
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(buyFuel, this);
};

function buyFuel() {
    if ((currentCity.oilPrice)&&(ship.money>0)) {
        ship.money -= currentCity.oilPrice;
        ship.fuel += 100;
        if (ship.money < 0) {
            ship.money = 0;
        }
    } else {
    }
};

function setupWorld() {
    var mapwidth = 2000+500;
    var mapheight = 1458;
    game.world.setBounds(0, 0, mapwidth, mapheight);
    water = game.add.tileSprite(0, 0, WIDTH, HEIGHT, "water");
    water.fixedToCamera = true;

    map = game.add.sprite(mapwidth/2, mapheight/2, "map");
    game.physics.p2.enable(map);
    map.body.clearShapes();
    map.body.loadPolygon("colMap", "map");

    map.fixedRotation = true;
    map.body.motionState = Phaser.Physics.P2.Body.STATIC;

    map.body.velocity = {}
};

function setupShip() {
    ship = game.add.sprite(1000, 500, "ship");
    game.physics.p2.enable(ship);
    ship.body.clearShapes();
    ship.body.loadPolygon("colShip", "ship");
    ship.body.collideWorldBounds = true;
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.damping = 0.8;
    ship.speed = 0;
    ship.money = 5000;
    ship.fuel = 1000;
};

function setupCities() {
    cities.forEach(function(c) {
        game.add.sprite(c.x, c.y, "city");
        c.label = game.add.sprite(c.x-80, c.y-60, c.labelFile);
        c.label.kill();
    });
};

function update () {
    // thurst
    if ((cursors.up.isDown)&&(ship.fuel > 0)){
        ship.body.thrust(200);
        ship.fuel -= 1;
        if (ship.fuel < 0) {
            ship.fuel = 0;
        }
    } else if ((cursors.down.isDown)&&(ship.fuel > 0)) {
        ship.body.thrust(-50);
        ship.fuel -= 0.5;
    }

    // rotation
    if (cursors.left.isDown){
        ship.body.rotateLeft(50);
    } else if (cursors.right.isDown) {
        ship.body.rotateRight(50);
    } else {
        ship.body.setZeroRotation();
    }

    // loop through each city
    currentCity = {};
    cities.forEach(function(c){
        // if ship is nearby
        if ((Math.abs(ship.body.x - c.x)<=100)&&(Math.abs(ship.body.y - c.y)<=100)) {
            c.label.revive();
            currentCity = c;
            if (currentCity.name == "New York") {
                ship.pickedLeap = true;
            } else if (currentCity.name == "Johannesburgh") {
                ship.pickedBurg = true;
            } else if (currentCity.name == "Melbourne") {
                ship.pickedOculus = true;
            } else if (currentCity.name == "Seoul") {
                ship.pickedKurt = true;
            }
            // gamewin
            if ((currentCity.name=="Manchester")&&(allItemsPicked === true)) {
                itemsDelivered = true; 
            }

        } else {
            c.label.kill();
        }
    });

    // check if all items have been picked up
    if ((ship.pickedLeap)&&(ship.pickedBurg)&&(ship.pickedOculus)&&(ship.pickedKurt)) {
        allItemsPicked = true;
    }

    water.tilePosition.x = -game.camera.x;
    water.tilePosition.y = -game.camera.y;
};

var pressed = false;
function render () {
    // draw sidebar
    ctx.clearRect(0, 0, 300, 185);

    // draw city info
    if (currentCity.name) {
        ctx.font = "16px Consolas";
        ctx.fillStyle = "#ffffff"
        ctx.fillText(currentCity.name, 10, 100);
        ctx.fillText("Fuel price: $"+currentCity.oilPrice+"/100L", 10, 130);
        ctx.fillText("To buy fuel:", 10, 500);
        ctx.drawImage(document.getElementById("sup"), 125, 475);

/*
        setTimeout(function(){
            ctx.drawImage(document.getElementById("sup"), 125, 475);
        }, 1000);
        setTimeout(function(){
            ctx.drawImage(document.getElementById("sdown"), 125, 475);
        }, 2000);
*/
        ctx.fillText("Item located: "+currentCity.item, 10, 180);

        if (currentCity.name!=="Manchester") {
            // draw item images
            var img = document.getElementById(currentCity.elementName);
            ctx.drawImage(img, currentCity.itemx, currentCity.itemy);
            ctx.fillText(currentCity.item, currentCity.itemx, currentCity.itemy+112);
        }
    }

    // draw GUI
    if (itemsDelivered == false) {
        ctx.font = "16px Consolas";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Money: $" + ship.money, 10, 30);
        ctx.fillText("Fuel left: " + ship.fuel + "L", 10, 50);
    // draw gamewin condition
    } else {
        ctx.clearRect(0, 0, 300, 185);
        ctx.fillStyle = "#00dd00";
        ctx.font = "32px Consolas";
        ctx.fillText("WOOT Win!!", 60, 100);
    }

};
