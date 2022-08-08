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
    
    // for cross browser
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const scriptProcessor = audioCtx.createScriptProcessor(2048, 1, 1);
    const analyser = audioCtx.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024; // Canvas variables

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

    // load some sound
    const track = audioCtx.createMediaElementSource(audioPlayer);
    track.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioCtx.destination);
    
    
    // play pause audio
    playButton.addEventListener('click', function() {
        
        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        if (this.dataset.playing === 'false') {
            audioPlayer.play();
            this.dataset.playing = 'true';
            playButton.classList.add('button--active');
            playButton.classList.add('button--stop');
            playButton.classList.remove('button--play');
            playButtonIcon.classList.add('bi-stop-fill');
            playButtonIcon.classList.remove('bi-play-fill');
            audioRecordStartTime = new Date();
            showTime();
        // if track is playing pause it
        } else if (this.dataset.playing === 'true') {
            audioPlayer.pause();
            this.dataset.playing = 'false';
            audioPlayer.currentTime = 0;
            playButton.classList.remove('button--active');
            playButton.classList.remove('button--stop');
            playButton.classList.add('button--play');
            playButtonIcon.classList.add('bi-play-fill');
            playButtonIcon.classList.remove('bi-stop-fill');
            clearInterval(elapsedTimeTimer);
        }
        
        let state = this.getAttribute('aria-checked') === "true" ? true : false;
        this.setAttribute( 'aria-checked', state ? "false" : "true" );
        scriptProcessor.onaudioprocess = processInput;
        setupWaveform();
        
    }, false);
    
    // if track ends
    audioPlayer.addEventListener('ended', () => {
        playButton.dataset.playing = 'false';
        playButton.setAttribute( "aria-checked", "false" );
    }, false);
    
    // volume
    const gainNode = audioCtx.createGain();
    
    // panning
    const pannerOptions = {pan: 0};
    const panner = new StereoPannerNode(audioCtx, pannerOptions);
    
    // connect our graph
    track.connect(gainNode).connect(panner).connect(audioCtx.destination);

    const showTime = () => {
        elapsedTimeTimer = setInterval(() => {
            //compute the elapsed time every second
            let elapsedTime = computeElapsedTime(audioRecordStartTime); //pass the actual record start time
            //display the elapsed time
            elapsedTimeTag.innerHTML = elapsedTime;
        }, 1000); //every second
    }
     
    const setupWaveform = () => {
        canvasContext = canvas.getContext('2d');
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        halfHeight = canvas.offsetHeight / 2;
        canvasContext.canvas.width = width;
        canvasContext.canvas.height = height;
        
    }; // Process the microphone input
    
    
    const processInput = audioProcessingEvent => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        bars.push(getAverageVolume(array));
        
        if (bars.length <= Math.floor(width / (barWidth + barGutter))) {
            renderBars(bars);
        } else {
            renderBars(bars.slice(bars.length - Math.floor(width / (barWidth + barGutter))), bars.length);
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
    

})();