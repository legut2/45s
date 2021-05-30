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

declare class WebAudioRecorder {
  public onComplete(recorder: WebAudioRecorder, blob: Blob): void;
  public encoding: string;
  public startRecording(): void;
  public finishRecording(): void;
  public setOptions(opts: RuntimeSettings): void;
  constructor(node: MediaStreamAudioSourceNode, opts: WebAudioRecorderOpts)
}

function __log(msg: string) {
  console.log(msg);
}

const AudioStuff = {
  startRecording(encodingType: string) {
    console.log("startRecording() called");

    let constraints = { audio: true, video: false }
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream: MediaStream) {
      const audioContext = new AudioContext();
      const input = audioContext.createMediaStreamSource(stream);

      input.connect(audioContext.destination);

      const recorder = new WebAudioRecorder(input, {
        workerDir: "js/", //  must end with slash
        encoding: encodingType,
        numChannels: 2, // 2 is the default, mp3 encoding supports only 2
        onEncoderLoading: function (_recorder, encoding) {
          __log("Loading " + encoding + " encoder...");
        },
        onEncoderLoaded: function (_recorder, encoding) {
          //  hide "loading encoder..." display
          __log(encoding + " encoder loaded");
        }
      });

      recorder.onComplete = function (recorder, blob) {
        __log("Encoding complete");
        AudioStuff.HandleAudio(blob, recorder.encoding);
      }

      recorder.setOptions({
        timeLimit: 120,
        encodeAfterRecord: true,
        ogg: { quality: 0.5 },
        mp3: { bitRate: 160 }
      });

      // start the recording process
      recorder.startRecording();

      __log("Recording started");

    }).catch(function (err: Error) { console.dir(err); });
  },
  stopRecording(recorder: WebAudioRecorder, gumStream: MediaStream) {
    console.log("stopRecording() called");

    const blah = gumStream.getAudioTracks()[0];
    if (blah) {
      blah.stop();
    }

    recorder.finishRecording();

    __log('Recording stopped');
  },
  HandleAudio(blob: Blob, encoding: string) {
    let url = URL.createObjectURL(blob);
    console.log(encoding);
    console.dir(url);
    alert("DONE!");
  }
}

