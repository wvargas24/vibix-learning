"use strict";

/**
 * @author: Sam Bellen
 * @description: Draw a waveform from the microphone's audio.
 *               Tested in Chrome and Firefox.
 */
(function () {
    if (!window.AudioContext) {
        setMessage('Your browser does not support window.Audiocontext. This is needed for this demo to work. Please try again in a differen browser.');
    } // UI Elements


    const removeRecorder = document.querySelector('#removeVoiceNoteConfirm');
    
    const recordButton = document.querySelector('.js-record');    
    const micContainer = recordButton.parentNode.parentNode.parentNode;
    const recorderBox = recordButton.parentNode.parentNode;
    const toolbar = recordButton.parentNode;
    const stopButton = toolbar.querySelector('.js-stop');
    const playButton = toolbar.querySelector('.js-play');
    const audioPlayer = toolbar.querySelector('.js-audio');
    const playButtonIcon = toolbar.querySelector('.js-play .bi'); // Constants
    const elapsedTimeTag = recorderBox.querySelector('.js-time');
    const canvas = recorderBox.querySelector('.js-canvas');
    const messageContainer = micContainer.querySelector('.js-message');
    
    let audioContext = null;
    let scriptProcessor = null;
    let analyser = null;

    const chunks = []; // Variables
    
    let stream = null;
    let input = null;
    let recorder = null;
    let recording = null;
    let isRecording = false;
    let isPlaying = false; // Setup analyser node
    
    
    
    const barWidth = 3;
    const barGutter = 3;
    const barColor = "#AEAEAE";
    let canvasContext = canvas.getContext('2d');
    let bars = [];
    let width = 0;
    let height = 0;
    let halfHeight = 0;
    let drawing = false; // Show a message in the UI
    
    var audioRecordStartTime;
    var elapsedTimeTimer;
    
    const setMessage = message => {
        messageContainer.innerHTML = message;
        messageContainer.classList.add('message--visible');
        messageContainer.classList.add('ps-3');
    }; // Hide the message
    
    
    const hideMessage = () => {
        messageContainer.classList.remove('message--visible');
        messageContainer.classList.remove('ps-3');
    }; // Request access to the user's microphone.
    
    
    const requestMicrophoneAccess = () => {
        audioContext = new AudioContext();
        scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
        analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024; // Canvas variables

        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(stream => {
                setAudioStream(stream);
            }, error => {
                setMessage('Something went wrong requesting the userMedia. <br/>Please make sure you are viewing this page over https.');
            });
        } else {
            setMessage('Your browser does not support navigator.mediadevices. <br/>This is needed for this page to work. Please try again in a differen browser.');
        }
        setupPlayer(); // Add event listeners to the buttons
    }; // Set all variables which needed the audio stream
    
    
    const setAudioStream = stream => {
        stream = stream;
        input = audioContext.createMediaStreamSource(stream);
        recorder = new window.MediaRecorder(stream);
        setRecorderActions();
        startRecording();
        setupWaveform();
    }; // Setup the recorder actions
    
    
    const setRecorderActions = () => {
        recorder.ondataavailable = saveChunkToRecording;
        recorder.onstop = saveRecording;
    }; // Save chunks of the incomming audio to the chuncks array
    
    const destroyListeners = () => {
        recorder.ondataavailable = undefined;
        recorder.onstop = undefined;
    };
    
    
    const saveChunkToRecording = event => {
        chunks.push(event.data);
    }; // Save the recording
    
    
    const saveRecording = () => {
        recording = URL.createObjectURL(new Blob(chunks, {
            'type': 'audio/ogg; codecs=opus'
        }));
        
        chunks: [];
        
        audioPlayer.setAttribute('src', recording);
        playButton.classList.remove('button--disabled');
    }; // Start recording
    
    
    const startRecording = () => {
        isRecording = true;
        recorder.start();
        //store the recording start time to display the elapsed time according to it
        audioRecordStartTime = new Date();
    }; // Stop recording
    
    
    const stopRecording = () => {
        isRecording = false;
        recorder.stop();
    }; // Toggle the recording button
    
    
    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }; // Setup the canvas to draw the waveform
    
    
    const setupWaveform = () => {
        canvasContext = canvas.getContext('2d');
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        halfHeight = canvas.offsetHeight / 2;
        canvasContext.canvas.width = width;
        canvasContext.canvas.height = height;
        input.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        scriptProcessor.onaudioprocess = processInput;
    }; // Process the microphone input
    
    
    const processInput = audioProcessingEvent => {
        if (isRecording) {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            bars.push(getAverageVolume(array));
            
            if (bars.length <= Math.floor(width / (barWidth + barGutter))) {
                renderBars(bars);
            } else {
                renderBars(bars.slice(bars.length - Math.floor(width / (barWidth + barGutter))), bars.length);
            }
        } else {
            bars = [];
        }
    }; // Calculate the average volume
    
    
    const getAverageVolume = array => {
        const length = array.length;
        let values = 0;
        let i = 0;
        
        for (; i < length; i++) {
            values += array[i];
        }
        
        return values / length;
    }; // Render the bars
    
    
    const renderBars = bars => {
        if (!drawing) {
            drawing = true;
            window.requestAnimationFrame(() => {
                canvasContext.clearRect(0, 0, width, height);
                bars.forEach((bar, index) => {
                    canvasContext.fillStyle = barColor;
                    canvasContext.fillRect(index * (barWidth + barGutter), halfHeight, barWidth, halfHeight * (bar / 100));
                    canvasContext.fillRect(index * (barWidth + barGutter), halfHeight - halfHeight * (bar / 100), barWidth, halfHeight * (bar / 100));
                });
                drawing = false;
            });
        }
    }; // Play the recording
    
    
    const play = () => {
        isPlaying = true;
        audioPlayer.play();
        playButton.classList.add('button--active');
        playButtonIcon.classList.add('bi-pause-fill');
        playButtonIcon.classList.remove('bi-play-fill');
    }; // Stop the recording
    
    
    const stop = () => {
        isPlaying = false;
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        playButton.classList.remove('button--active');
        playButtonIcon.classList.add('bi-play-fill');
        playButtonIcon.classList.remove('bi-pause-fill');
    }; // Toggle the play button
    
    
    const togglePlay = () => {
        if (isPlaying) {
            stop();
        } else {
            play();
        }
    }; // Setup the audio player
    
    
    const setupPlayer = () => {
        audioPlayer.addEventListener('ended', () => {
            stop();
        });
    }; // Start the application
    
    //recordButton.addEventListener('mouseup', toggleRecording);
    recordButton.onclick = function(e) { 
        e.preventDefault();
        requestMicrophoneAccess();
        recordButton.classList.add('button--active');
        recordButton.style.display = "none";
        stopButton.style.display = 'block';
        recorderBox.classList.add('recorder');
        setMessage('Recording...');
        //Handle the displaying of the elapsed recording time
        elapsedTimeTimer = setInterval(() => {
            //compute the elapsed time every second
            let elapsedTime = computeElapsedTime(audioRecordStartTime); //pass the actual record start time
            //display the elapsed time
            elapsedTimeTag.innerHTML = elapsedTime;
        }, 1000); //every second
    }
    
    function computeElapsedTime(startTime) {
        //record end time
        let endTime = new Date();
        
        //time difference in ms
        let timeDiff = endTime - startTime;
        
        //convert time difference from ms to seconds
        timeDiff = timeDiff / 1000;
        
        //extract integer seconds that dont form a minute using %
        let seconds = Math.floor(timeDiff % 60); //ignoring uncomplete seconds (floor)
        
        //pad seconds with a zero if neccessary
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        //convert time difference from seconds to minutes using %
        timeDiff = Math.floor(timeDiff / 60);
        
        //extract integer minutes that don't form an hour using %
        let minutes = timeDiff % 60; //no need to floor possible incomplete minutes, becase they've been handled as seconds
        minutes = minutes < 10 ? "0" + minutes : minutes;
        
        //convert time difference from minutes to hours
        timeDiff = Math.floor(timeDiff / 60);
        
        //extract integer hours that don't form a day using %
        let hours = timeDiff % 24; //no need to floor possible incomplete hours, becase they've been handled as seconds
        
        //convert time difference from hours to days
        timeDiff = Math.floor(timeDiff / 24);
        
        // the rest of timeDiff is number of days
        let days = timeDiff; //add days to hours
        
        let totalHours = hours + (days * 24);
        totalHours = totalHours < 10 ? "0" + totalHours : totalHours;
        
        if (totalHours === "00") {
            return minutes + ":" + seconds;
        } else {
            return totalHours + ":" + minutes + ":" + seconds;
        }
    }
    
    stopButton.onclick = function(e) { 
        e.preventDefault();
        stopRecording();
        recordButton.classList.remove('button--active');
        stopButton.style.display = "none";
        playButton.style.display = "block";
        setMessage('');
        var _btnshowcomment = $("<a/>")
        .addClass("btn btn-remove-record")
        .attr("href", "#")
        .attr("role", "button")
        .attr("data-toggle", "modal")
        .html('<i class="bi bi-trash-fill"></i>')
        .on("click", function (e) {
            e.preventDefault();
            $('#removeVoiceNoteModal').modal('toggle');
        });
        $('.js-message').html(_btnshowcomment);
        $('.js-message').removeClass('ps-3');
        //stop interval that handles both time elapsed and the red dot
        clearInterval(elapsedTimeTimer);
    }
    
    removeRecorder.onclick = function (e) {
        e.preventDefault();
        if (isPlaying) {
            stop();
        }
        $('.btn-remove-record').css('display','none');
        recordButton.style.display = "block";
        playButton.style.display = "none";
        recorderBox.classList.remove('recorder');
        console.log(stream);
        $('#removeVoiceNoteModal').modal('toggle');
        
    }
    
    // playButton.addEventListener('mouseup', togglePlay);

    playButton.onclick = function (e) {
        e.preventDefault();
        togglePlay();
    }
})();