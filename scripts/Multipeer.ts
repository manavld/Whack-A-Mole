
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

(async function () {  

    var ScoreReceived = await Patches.outputs.getScalar("ScoreToCompare") as ScalarSignal;

    var BestScore =  0;

    ScoreReceived.monitor().subscribe( function(e) {
        if (e.newValue > BestScore) {
          Diagnostics.log('NewBest!');
          BestScore += 1;
          Patches.inputs.set("BestScore", BestScore);
        }
    });

    
})(); 