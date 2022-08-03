(async () => {
    let volumeCallback = null;
    let volumeInterval = null;
    const volumeVisualizer = document.getElementById('volume-visualizer');
    const recordBox = document.querySelector('.recording-box');
    const recordButton = document.querySelector('#record');
    const stopButton = document.querySelector('#stop');
    const playButton = document.querySelector('#play');
    const saveButton = document.querySelector('#save');
    const savedAudioMessagesContainer = document.querySelector('#saved-audio-messages');
    const textRecord = document.getElementById("texActivity");
    const timeSelector = document.getElementById("time");

    let recorder;
    let audio;

    const recordAudio = () =>
        new Promise(async resolve => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const audioContext = new AudioContext();
            const audioSource = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            analyser.minDecibels = -127;
            analyser.maxDecibels = 0;
            analyser.smoothingTimeConstant = 0.4;
            audioSource.connect(analyser);
            const bufferLength = analyser.frequencyBinCount;
            const volumes = new Uint8Array(analyser.frequencyBinCount);
            volumeCallback = () => {
                analyser.getByteTimeDomainData(volumes);
                analyser.getByteFrequencyData(volumes);
                let volumeSum = 0;
                for (const volume of volumes)
                    volumeSum += volume;
                const averageVolume = volumeSum / volumes.length;
                volumeVisualizer.style.setProperty('--volume', (averageVolume * 100 / 127) + '%');
            };

            const mediaRecorder = new MediaRecorder(stream);
            let audioChunks = [];

            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });

            const start = () => {
                audioChunks = [];
                mediaRecorder.start();
            };

            const stop = () => new Promise(resolve => {
                mediaRecorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    const play = () => audio.play();
                    resolve({ audioChunks, audioBlob, audioUrl, play });
                });

                mediaRecorder.stop();
            });

            resolve({ start, stop });
    });

    const sleep = time => new Promise(resolve => setTimeout(resolve, time));

    recordButton.addEventListener('click', async () => {
        recordButton.setAttribute('disabled', true);
        recordButton.style.display = "none";
        stopButton.removeAttribute('disabled');
        stopButton.style.display = "block";
        recordBox.style.display = "flex";
        playButton.setAttribute('disabled', true);
        playButton.style.display = "none";
        saveButton.setAttribute('disabled', true);
        if (!recorder) {
            recorder = await recordAudio();
        }
        recorder.start();
        if (volumeCallback !== null && volumeInterval === null){
            volumeInterval = setInterval(volumeCallback, 100);
            textRecord.innerHTML = "Recording...";
        }
    });

    stopButton.addEventListener('click', async () => {
        recordButton.removeAttribute('disabled');
        stopButton.setAttribute('disabled', true);
        stopButton.style.display = "none";
        playButton.removeAttribute('disabled');
        playButton.style.display = "block";
        saveButton.removeAttribute('disabled');
        audio = await recorder.stop();
        if (volumeInterval !== null) {
            clearInterval(volumeInterval);
            volumeInterval = null;
            var _button = $("<a/>")
                .addClass("btn btn-info btn-remove-record")
                .attr("href", "#")
                .attr("role", "button")
                .attr("data-toggle", "modal")                
                .attr("id", "btn_delete_record")
                .html('<i class="bi bi-trash-fill"></i>')
                .on("click", function (e) {
                    e.preventDefault();
                    var _button = $(this);
                    //here is call function to delete record
                    _button.css('display','none');
                    recordBox.style.display = "none";                    
                    recordButton.removeAttribute('disabled');
                    recordButton.style.display = "block";
                    
                });
            $('#texActivity').html(_button);
        }
    });

    playButton.addEventListener('click', (e) => {
        e.preventDefault();
        audio.play();
    });

    saveButton.addEventListener('click', () => {
        const reader = new FileReader();
        reader.readAsDataURL(audio.audioBlob);
        reader.onload = () => {
            const base64AudioMessage = reader.result.split(',')[1];

            fetch('/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: base64AudioMessage })
            }).then(res => {
                if (res.status === 201) {
                    return populateAudioMessages();
                }
                console.log('Invalid status saving audio message: ' + res.status);
            });
        };
    });

    const populateAudioMessages = () => {
        return fetch('/messages').then(res => {
            if (res.status === 200) {
                return res.json().then(json => {
                    json.messageFilenames.forEach(filename => {
                        let audioElement = document.querySelector(`[data-audio-filename="${filename}"]`);
                        if (!audioElement) {
                            audioElement = document.createElement('audio');
                            audioElement.src = `/messages/${filename}`;
                            audioElement.setAttribute('data-audio-filename', filename);
                            audioElement.setAttribute('controls', true);
                            savedAudioMessagesContainer.appendChild(audioElement);
                        }
                    });
                });
            }
            console.log('Invalid status getting messages: ' + res.status);
        });
    };

    populateAudioMessages();
})();