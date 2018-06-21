
const filename = "out_gyro.txt";


var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {

const BOARD_RADIUS = 20;
const BOARD_DIAMETER = 40;
const WALL_WIDTH = 1;
var initialPositions = [];

var scene = new BABYLON.Scene(engine);
scene.enablePhysics(null, new BABYLON.CannonJSPlugin());

//Camera and light
var light = new BABYLON.PointLight("Point", new BABYLON.Vector3(5, 10, 5), scene);
var camera = new BABYLON.ArcRotateCamera("Camera", 1, 0, 30, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);

//BALLS
var y = 2;
for (var index = 0; index < 10; index++) {
    var sphere = BABYLON.Mesh.CreateSphere("Sphere0", 16, 0.5, scene);

    sphere.position.x = (BOARD_RADIUS / 4) * Math.cos(2 * Math.PI * Math.random());
    sphere.position.y = 2;
    sphere.position.z = (BOARD_RADIUS / 4) * Math.sin(2 * Math.PI * Math.random());

    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1000 }, scene);
}


//GROUND
var ground = BABYLON.Mesh.CreateCylinder("Ground", 1,1,1,100,1, scene);
        ground.scaling = new BABYLON.Vector3(BOARD_RADIUS, 1,BOARD_RADIUS);
        ground.position.y = 0;
        ground.checkCollisions = true;
        //ground.rotate(new BABYLON.Vector3(1,0,0), )
ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    {
        mass: 0,
        disableBidirectionalTransformation : false,
        friction: 0.5,
        restitution: 0
     }, scene);


//CEILING
var transparentMat = new BABYLON.StandardMaterial("transparentMat", scene);
transparentMat.alpha = 0.2;

var ceiling  = BABYLON.Mesh.CreateCylinder("ceiling", 1,1,1,100,1, scene);
ceiling.scaling = new BABYLON.Vector3(BOARD_RADIUS, 1,BOARD_RADIUS);
ceiling.position.y = 2.5;
ceiling.checkCollisions = true;
ceiling.material = transparentMat;
//
 initialPositions.push({
         object: ceiling,
         coords: [ceiling.position.x, ceiling.position.y, ceiling.position.z]
     });

ceiling.physicsImpostor = new BABYLON.PhysicsImpostor(
    ceiling,
    BABYLON.PhysicsImpostor.MeshImpostor,
    {
        mass: 0,
        disableBidirectionalTransformation : false,
        friction: 0.5,
        restitution: 0
     }, scene);


// GUI
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

var panel = new BABYLON.GUI.StackPanel();
panel.width = "220px";
panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
advancedTexture.addControl(panel);

var header1 = new BABYLON.GUI.TextBlock();
header1.text = "Y-rotation: 0 deg";
header1.height = "30px";
header1.color = "white";
panel.addControl(header1);

var slider1 = new BABYLON.GUI.Slider();
slider1.minimum = -0.7;
slider1.maximum = 0.7;
slider1.value = 0;
slider1.height = "20px";
slider1.width = "200px";
slider1.onValueChangedObservable.add(function(value) {
    header1.text = "X-rotation: " + (BABYLON.Tools.ToDegrees(value) | 0) + " deg";
    rotateOnX(value);
});
panel.addControl(slider1);

var header2 = new BABYLON.GUI.TextBlock();
header2.text = "Y-rotation: 0 deg";
header2.height = "30px";
header2.color = "white";
panel.addControl(header2);

var slider2 = new BABYLON.GUI.Slider();
slider2.minimum = - 0.7;
slider2.maximum =   0.7;
slider2.value = 0;
slider2.height = "20px";
slider2.width = "200px";
slider2.onValueChangedObservable.add(function(value) {
    header2.text = "Z-rotation: " + (BABYLON.Tools.ToDegrees(value) | 0) + " deg";
    rotateOnZ(value);
});
panel.addControl(slider2);

var rotate = function(obj, initialPos, rx, ry) {
    var a = [initialPos[0], initialPos[2], initialPos[1]];
    var rz = 0;

    var Rx= [[1,0,0],
            [0,Math.cos(ry),(-1)*Math.sin(ry)],
            [0,Math.sin(ry),     Math.cos(ry)]
    ];
    var Ry = [[Math.cos(rx),0,Math.sin(rx)],
                    [0,1,0],
                    [(-1)*Math.sin(rx),0,Math.cos(rx)]
    ];
    var Rz = [[Math.cos(rz), (-1) * Math.sin(rz), 0],
                    [Math.sin(rz), Math.cos(rz), 0],
                    [0, 0, 1]
    ];

    var  R = [[0,0,0],[0,0,0],[0,0,0]];
    var R1 = [[0,0,0],[0,0,0],[0,0,0]];

    var result = [0,0,0];

    for (var i = 0; i < 3 ; i = i + 1){
        for (var j = 0; j < 3 ; j = j + 1){
            for (var k = 0; k < 3 ; k = k + 1){
                R1[i][j] = R1[i][j] + Rz[i][k] * Rx[k][j];
            }
        }
    }

    for (var i = 0; i < 3 ; i = i + 1){
        for (var j = 0; j < 3 ; j = j + 1){
            for (var k = 0; k < 3 ; k = k + 1){
                R[i][j] = R[i][j] + R1[i][k] * Ry[k][j];
            }
        }
    }
    for(var i=0; i<3; i++){
        for(var j=0; j<3; j++){
            result[i] += R[i][j]* a[j];
        }
    }
    obj.position.z = result[0];
    obj.position.x = result[1];
    obj.position.y = result[2];

}
//Rotations:
var rotateOnX = function (value){
    if (ground) {
            ground.rotationQuaternion.x = value;
    }
    initialPositions.forEach(function(elem){
        rotate(elem.object,
            elem.coords,
            slider1.value * Math.PI / 1.4,
            slider2.value * Math.PI / 1.4
            )
        elem.object.rotationQuaternion.x = value;
    });

}

var rotateOnZ = function (value){
    if (ground) {
            ground.rotationQuaternion.z = value;
    }
    initialPositions.forEach(function(elem){
        rotate(elem.object,
            elem.coords,
            slider1.value * Math.PI / 1.4,
            slider2.value * Math.PI / 1.4
            )
        elem.object.rotationQuaternion.z = value;
    });
}


//WALLS:
//external one:
var outerRing = [];
var n = 100;
for( var i = 0; i < n; i ++){
    outerRing.push( BABYLON.Mesh.CreateCylinder("Ground", 1,1,1,30,1, scene));
    outerRing[i].scaling = new BABYLON.Vector3(WALL_WIDTH, 1.8,WALL_WIDTH);
    outerRing[i].position.y = 1.2;
    outerRing[i].position.x = BOARD_RADIUS / 2.2 * Math.cos(2 * Math.PI * i / n);
    outerRing[i].position.z = BOARD_RADIUS / 2.2 * Math.sin(2 * Math.PI * i / n);

    initialPositions.push(
        {   object: outerRing[i],
            coords: [
                outerRing[i].position.x,
                outerRing[i].position.y,
                outerRing[i].position.z]
        });

    outerRing[i].checkCollisions = true;
    outerRing[i].physicsImpostor = new BABYLON.PhysicsImpostor(
        outerRing[i],
        BABYLON.PhysicsImpostor.MeshImpostor,
        {
            mass: 0,
            disableBidirectionalTransformation : false,
            friction: 0.5,
            restitution: 0
         }, scene);
}
//walls with gates
var ringsWithGates = [];
var radius = BOARD_RADIUS / 2 - 1;
while ( radius > 1){
    radius -= 2;
    var ring = [];
    var n = radius * 10;
    var gateStart = Math.random() * (n - 3); // o pozitie random intre 0 si n-3

    for( var i = 0; i < n; i ++){
        if(radius < 3 || i < gateStart || i > (gateStart + 2))
        {
            ring.push( BABYLON.Mesh.CreateCylinder("Ground", 1,1,1,30,1, scene));
            ring[ring.length - 1].scaling = new BABYLON.Vector3(WALL_WIDTH,1.8,WALL_WIDTH);
            ring[ring.length - 1].position.y = 1.2;
            ring[ring.length - 1].position.x = radius * Math.cos(2 * Math.PI * i / n);
            ring[ring.length - 1].position.z = radius * Math.sin(2 * Math.PI * i / n);

            initialPositions.push(
                {   object: ring[ring.length - 1],
                    coords:
                    [ ring[ring.length - 1].position.x,
                      ring[ring.length - 1].position.y,
                      ring[ring.length - 1].position.z ]
                });

            ring[ring.length - 1].physicsImpostor = new BABYLON.PhysicsImpostor(
                ring[ring.length - 1],
                BABYLON.PhysicsImpostor.MeshImpostor,
                {
                    mass: 0,
                    disableBidirectionalTransformation : false,
                    friction: 0.5,
                    restitution: 0
                }, scene);
        }
    }
    ringsWithGates.push(ring);
}


//Keyboard EventListeners
 var map ={}; //object for multiple key presses
 scene.actionManager = new BABYLON.ActionManager(scene);

 scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    }));

 scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  var allText;
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
      if(rawFile.readyState === 4) {
          if(rawFile.status === 200 || rawFile.status == 0) {
               var str = rawFile.responseText;
               updateSliders(str.split(" ")[0], str.split(" ")[1]);
          }
      }
  }
  rawFile.send(null);
}

function updateSliders(x, y){
   if(x == null || y == null)
      return;
   console.log(x,y)

   if(Math.abs(x * 0.7 / 90) <= 30 && Math.abs((slider1.value * 90 / 0.7 - x)) > 1 )
      slider1.value = x * 0.7 / 90;
   if(Math.abs(y * 0.7 / 90) <= 30 && Math.abs((slider2.value * 90 / 0.7 - y)) > 1)
      slider2.value = y * 0.7 / 90;
}

var filter = 0;

scene.registerBeforeRender(function () {
        if(map["w"]  || map["W"])
            slider1.value -= 0.001;
        if(map["a"]  || map["A"])
             slider2.value -= 0.001;
        if(map["s"]  || map["S"])
             slider1.value += 0.001;
        if(map["d"]  || map["D"])
            slider2.value += 0.001;
        readTextFile(filename);

    });

return scene;
}

var scene = createScene()

engine.runRenderLoop(function () {
if (scene) {
    scene.render();
}
});


// Resize
window.addEventListener("resize", function () {
engine.resize();
});
