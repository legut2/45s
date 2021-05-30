
interface RecordingCB {
  (blob: Blob): void;
}
interface RuntimeSettings {
  timeLimit: number;
  encodeAfterRecord: boolean;
  ogg?: { quality: number };
  mp3?: { bitRate: number };
};

interface WebAudioRecorderOpts {
  workerDir: string;
  encoding: string;
  numChannels: number;
  onEncoderLoading(recorder: unknown, encoding: string): void;
  onEncoderLoaded(recorder: unknown, encoding: string): void;
}

class MyRecorder {
  public recorder?: WebAudioRecorder;
  public onSuccess: RecordingCB;
  public stream?: MediaStream;

  constructor(cb: RecordingCB) {
    this.onSuccess = cb;
  };

  private handleStream = (stream: MediaStream) => {
    var audioContext = new AudioContext();
    var input = audioContext.createMediaStreamSource(stream);
    input.connect(audioContext.destination);
    this.recorder = new WebAudioRecorder(input, {
      workerDir: "js/",
      encoding: "mp3",
      numChannels: 2,
      onEncoderLoading(_recorder: WebAudioRecorder, encoding: string) {
        console.log("Loading " + encoding + " encoder...");
      },
      onEncoderLoaded(_recorder: WebAudioRecorder, encoding: string) {
        //  hide "loading encoder..." display
        console.log(encoding + " encoder loaded");
      }
    });

    this.recorder.onComplete = (_recorder, blob) => {
      console.log("Encoding complete");
      this.onSuccess(blob);
    };

    this.recorder.setOptions({
      timeLimit: 120,
      encodeAfterRecord: true,
      ogg: { quality: 0.5 },
      mp3: { bitRate: 160 }
    });
    // start the recording process
    this.recorder.startRecording();
    console.log("Recording started");
    this.stream = stream;
  };

  startRecording = () => {
    navigator
      .mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(this.handleStream)
      .catch((err: Error) => { console.dir(err); });
  }

  stopRecording() {
    console.log("stopRecording() called");
    if (this.stream) {
      var blah = this.stream.getAudioTracks()[0];
      blah && blah.stop();
      if (this.recorder) {
        this.recorder.finishRecording();
      }
    }
    console.log('Recording stopped');
  }

  // _handleAudio(blob: Blob) {
  //   var url = URL.createObjectURL(blob);
  //   console.dir(url);
  //   alert("DONE!");
  // }
};

window.thatRecorder = new MyRecorder((data) => {
  console.dir(data);
});
