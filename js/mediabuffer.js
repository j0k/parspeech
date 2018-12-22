var audioChunks = [];

var handleSuccess = function(stream) {
  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.addEventListener("dataavailable", event => {
    audioChunks.push(event.data);
  });

  const start = () => {
    mediaRecorder.start();
  };

  const stop = () => {
    return new Promise(resolve => {
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        const play = () => {
          audio.play();
        };

        resolve({
          audioBlob,
          audioUrl,
          play
        });
      });

      mediaRecorder.stop();
    });
  };

  resolve({
    start,
    stop
  });

  // var context = new AudioContext();
  // var source = context.createMediaStreamSource(stream);
  // var processor = context.createScriptProcessor(1024, 1, 1);
  //
  // source.connect(processor);
  // processor.connect(context.destination);
  //
  // processor.onaudioprocess = function(e) {
  //   // Do something with the data, i.e Convert this to WAV
  //   console.log(e.inputBuffer);
  //   b = e.inputBuffer.getChannelData(0);
  // };
};

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  })
  .then(handleSuccess);
