
import Scene from 'Scene';
import Diagnostics from 'Diagnostics';
import Reactive from 'Reactive';
import Animation from 'Animation';
import FaceGesturesModule from 'FaceGestures';
import FaceTrackingModule from 'FaceTracking';
import Patches from 'Patches';
import TouchGesturesModule from "TouchGestures";
import Materials from 'Materials';
import Time from 'Time';
import CameraInfo from 'CameraInfo';

    //Globals
const ToleranceX = Reactive.val(30);
const ToleranceY = Reactive.val(30);
var colliderObject = [];
var GameComplete = Reactive.val(false) as BoolSignal;
var Score = Reactive.val(0) as ScalarSignal;

    //Check Individual Collision
function CheckCollision(posX: ScalarSignal, posX2: ScalarSignal, posZ: ScalarSignal, posZ2: ScalarSignal, rangeX: ScalarSignal, rangeY: ScalarSignal){
    var x = posX.sub(posX2).le(rangeX).and(posX.sub(posX2).ge(rangeX.neg()));
    var z = posZ.sub(posZ2).le(rangeY).and(posZ.sub(posZ2).ge(rangeY.neg()));
    return x.and(z);
}

    //Check all collisions of main object with array of objects
function CheckCollisionAll(mainObject: SceneObjectBase, otherObjects: Array<SceneObjectBase>){
    var Collision = [];
    for (var i = 0; i < otherObjects.length; i++){
        Collision[i] = CheckCollision(mainObject.transform.position.x, otherObjects[i].transform.x, mainObject.transform.position.y, 
            otherObjects[i].transform.y, ToleranceX, ToleranceY);
        colliderObject[i] = Collision[i].ifThenElse(1, 0);
    }
    return Reactive.orList(Collision);
}

(async function () {  

    const Player =  await Scene.root.findFirst("2D Position") as SceneObjectBase;
    const PositionPlayer = await Patches.outputs.getPoint2D("HammerPosition");
    const MolesParent = await Scene.root.findFirst("ReactionMenu") as SceneObjectBase;
    const Moles = await MolesParent.findByPath("*") as SceneObjectBase[];
    //const GradientObtained_Mat = await Materials.findFirst("GradientObtained") as DefaultMaterial;
    //const FloorObtained_Mat = await Materials.findFirst("FloorObtained") as DefaultMaterial;
    //const LogoObtained_Mat = await Materials.findFirst("CupraObtained") as DefaultMaterial;
    await Patches.inputs.setBoolean("GameComplete", GameComplete);
    await Patches.inputs.setScalar("Score", Score);
    //const TestingMole = await Scene.root.findFirst("TopRight") as SceneObjectBase;
    const TopRight = await Patches.outputs.getBoolean("TopRight");
    const TopLeft = await Patches.outputs.getBoolean("TopLeft");
    const BottomRight = await Patches.outputs.getBoolean("BottomRight");
    const BottomLeft = await Patches.outputs.getBoolean("BottomLeft");

        //Active moles dictionary
    //Scene order: TR, BR, TL, BL
    const ActiveMole = [TopRight, BottomRight, TopLeft, BottomLeft] as BoolSignal[];

        //Childs
    const MolePlanes = [] as SceneObjectBase[];

    for (var i = 0; i < Moles.length; i++){
        MolePlanes[i] = await Moles[i].findFirst("Mole") as SceneObjectBase;
    }


        //Utility variables
    var MoleHit_Scalar = Reactive.val(0);
    var prev_Scalar = Reactive.val(0);
    var counter = 0;

        //Prints
    //Diagnostics.watch("Collision: ", CheckCollision(Player.transform.position.x, TestingMole.transform.position.x, Player.transform.position.y, TestingMole.transform.position.y, ToleranceX, ToleranceY));
    //Diagnostics.watch("TopRight: ", TopRight);
    
        //Collision Action
    CheckCollisionAll(Player, Moles).onOn().subscribe(() => {
        
            //Find Collision Object
        for (var i = 0; i < colliderObject.length; i++){
            if(colliderObject[i].pinLastValue() == 1){
                Diagnostics.log(Moles[i].name);
                
                //Check if Mole is Out
                if(ActiveMole[i].pinLastValue() == true){
                    Diagnostics.log("COLLISION: ");
                    Patches.inputs.set("Collision", Reactive.once());
                        //DO STUFF TO THE COLLECTED OBJECT
                    //MolePlanes[i].hidden = Reactive.val(true);

                        //For Scoring System
                    //ScalarSignal
                    prev_Scalar = MoleHit_Scalar;
                    MoleHit_Scalar = prev_Scalar.add(1);
                    Diagnostics.log(MoleHit_Scalar.pinLastValue());
                    Patches.inputs.set("Score", MoleHit_Scalar.pinLastValue());
                    //Number
                    counter += 1;
                    Diagnostics.log(counter); 

                }
                       
                
            }
                
        }

            //ALL HOTSPOTS GOTTEN:
        if(counter == 10){
            Diagnostics.log("COMPLETED");
            Patches.inputs.set("GameComplete", true);
        }

    });
    

})(); 
