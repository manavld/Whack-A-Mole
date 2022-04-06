
// How to load in modules
import Scene from 'Scene';
import Diagnostics from 'Diagnostics';
import Reactive from 'Reactive';

(async function () {  

    const plane = await Scene.root.findFirst("Hey") as SceneObjectBase;

    //plane.transform.rotationX = Reactive.val(0.3);

})(); 