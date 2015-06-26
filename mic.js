$(document).ready(function() {

$("#test").click(function(){

    var recorder = null,
        analyser = null,
        dataArray = null,
        canvas = document.querySelector('.visualizer'),
        canvasCtx = canvas.getContext("2d"),
        drawVisual = null,
        um = Modernizr.prefixed('getUserMedia', navigator);

    //todo: hook into existing viz code
    var visualize = function()
        {
            analyser.fftSize = 2048;
            dataArray = new Uint8Array(analyser.frequencyBinCount);

            var bufferLength = analyser.fftSize;

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            function draw()
            {
                drawVisual = requestAnimationFrame(draw);

                analyser.getByteTimeDomainData(dataArray);

                canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

                canvasCtx.beginPath();

                var sliceWidth = canvas.width * (1.0 / bufferLength),
                    x = 0;

                for (var i = 0; i < bufferLength; i++)
                {
                    var v = dataArray[i] / 128.0;
                    var y = v * canvas.height / 2.0;

                    if (i === 0)
                    {
                        canvasCtx.moveTo(x, y);
                    }
                    else
                    {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                canvasCtx.lineTo(canvas.width, canvas.height / 2.0);
                canvasCtx.stroke();
            }

            draw();
        },
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

            // create an analyser node for some sweet ass visualizations
            analyser = context.createAnalyser();
            analyser.minDecibels = -90;
            analyser.maxDecibels = -10;
            analyser.smoothingTimeConstant = 0.85;

            // retrieve the current sample rate to be used for WAV packaging
            sampleRate = context.sampleRate;

            // creates a gain node
            volume = context.createGain();

            // creates an audio node from the microphone incoming stream
            audioInput = context.createMediaStreamSource(e);

            audioInput.connect(analyser);

            // connect the stream to the gain node
            audioInput.connect(volume);

            visualize();
            /*
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
            */
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
