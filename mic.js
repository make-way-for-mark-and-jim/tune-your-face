$(document).ready(function() {

$("#test").click(function(){

    var
        recorder = null,
        um = Modernizr.prefixed('getUserMedia', navigator);

    var
        error = function(e)
        {
            console.log('Failed to access mic', e);
        },
        // see: http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
        success = function(e)
        {
            console.log('Acquired mic');

            // creates the audio context
            audioContext = window.AudioContext || window.webkitAudioContext;
            context = new audioContext();

            // retrieve the current sample rate to be used for WAV packaging
            sampleRate = context.sampleRate;

            // creates a gain node
            volume = context.createGain();

            // creates an audio node from the microphone incoming stream
            audioInput = context.createMediaStreamSource(e);

            // connect the stream to the gain node
            audioInput.connect(volume);

            var bufferSize = 2048;
            recorder = context.createScriptProcessor(bufferSize, 2, 2);

            recorder.onaudioprocess = function(e){
                console.log ('recording');
//                var left = e.inputBuffer.getChannelData (0);
//                var right = e.inputBuffer.getChannelData (1);
//                // we clone the samples
//                leftchannel.push (new Float32Array (left));
//                rightchannel.push (new Float32Array (right));
//                recordingLength += bufferSize;
            }

            // we connect the recorder
            volume.connect (recorder);
            recorder.connect (context.destination);
        };


    if (um)
    {
        um ({audio : true}, success, error);
    }
    else
    {
        console.log("No UM");
    }

    });

});
