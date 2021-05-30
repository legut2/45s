// // webkitURL is deprecated but nevertheless
// URL = window.URL || window.webkitURL;

// interface RuntimeSettings {
//   timeLimit: number;
//   encodeAfterRecord: boolean;
//   ogg?: { quality: number };
//   mp3?: { bitRate: number };
// };

// interface WebAudioRecorderOpts {
//   workerDir: string;
//   encoding: string;
//   numChannels: number;
//   onEncoderLoading(recorder: unknown, encoding: string): void;
//   onEncoderLoaded(recorder: unknown, encoding: string): void;
// }

// declare class WebAudioRecorder {
//   public onComplete(recorder: WebAudioRecorder, blob: Blob): void;
//   public encoding: string;
//   public startRecording(): void;
//   public finishRecording(): void;
//   public setOptions(opts: RuntimeSettings): void;
//   constructor(node: MediaStreamAudioSourceNode, opts: WebAudioRecorderOpts)
// }

// declare const recordingsList: HTMLOListElement;
// declare const log: HTMLPreElement;

// let gumStream: MediaStream;       // stream from getUserMedia()
// let recorder: WebAudioRecorder;       // WebAudioRecorder object
// let input: MediaStreamAudioSourceNode;         // MediaStreamAudioSourceNode  we'll be recording
// let encodingType: string;     // holds selected encoding for resulting audio (file)
// let encodeAfterRecord = true;       //  when to encode

// let audioContext: AudioContext; // new audio context to help us record

// let encodingTypeSelect = document.getElementById("encodingTypeSelect") as HTMLSelectElement;
// let recordButton = document.getElementById("recordButton") as HTMLButtonElement;
// let stopButton = document.getElementById("stopButton") as HTMLButtonElement;

// // add events to those 2 buttons
// recordButton.addEventListener("click", startRecording);
// stopButton.addEventListener("click", stopRecording);

// function startRecording() {
//   console.log("startRecording() called");

//   /*
//     Simple constraints object, for more advanced features see
//     https:// addpipe.com/blog/audio-constraints-getusermedia/
//   */

//   let constraints = { audio: true, video: false }

//   /*
//     We're using the standard promise based getUserMedia()
//     https:// developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
// */

//   navigator.mediaDevices.getUserMedia(constraints).then(function (stream: MediaStream) {
//     __log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

//     /*
//       create an audio context after getUserMedia is called
//       sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
//       the sampleRate defaults to the one set in your OS for your playback device

//     */
//     audioContext = new AudioContext();

//     const el = document.getElementById("formats") as HTMLDivElement;
//     // update the format
//     const val0 = encodingTypeSelect.options[encodingTypeSelect.selectedIndex];
//     if (val0) {
//       el.innerHTML = "Format: 2 channel " + val0.value + " @ " + audioContext.sampleRate / 1000 + "kHz"
//     }

//     // assign to gumStream for: MediaStream later use
//     gumStream = stream;

//     /* use the stream */
//     input = audioContext.createMediaStreamSource(stream);

//     // stop the input from playing back through the speakers
//     // input.connect(audioContext.destination)

//     // get the encoding
//     const val = encodingTypeSelect.options[encodingTypeSelect.selectedIndex];
//     if (val) {
//       encodingType = val.value;
//     }

//     // disable the encoding selector
//     encodingTypeSelect.disabled = true;

//     recorder = new WebAudioRecorder(input, {
//       workerDir: "js/", //  must end with slash
//       encoding: encodingType,
//       numChannels: 2, // 2 is the default, mp3 encoding supports only 2
//       onEncoderLoading: function (_recorder, encoding) {
//         //  show "loading encoder..." display
//         __log("Loading " + encoding + " encoder...");
//       },
//       onEncoderLoaded: function (_recorder, encoding) {
//         //  hide "loading encoder..." display
//         __log(encoding + " encoder loaded");
//       }
//     });

//     recorder.onComplete = function (recorder, blob) {
//       __log("Encoding complete");
//       HandleAudio(blob, recorder.encoding);
//       encodingTypeSelect.disabled = false;
//     }

//     recorder.setOptions({
//       timeLimit: 120,
//       encodeAfterRecord: encodeAfterRecord,
//       ogg: { quality: 0.5 },
//       mp3: { bitRate: 160 }
//     });

//     // start the recording process
//     recorder.startRecording();

//     __log("Recording started");

//   }).catch(function (err) {
//     // enable the record button if getUSerMedia() fails
//     recordButton.disabled = false;
//     stopButton.disabled = true;
//   });

//   // disable the record button
//   recordButton.disabled = true;
//   stopButton.disabled = false;
// }

// function stopRecording() {
//   console.log("stopRecording() called");

//   // stop microphone access
//   const blah = gumStream.getAudioTracks()[0];
//   if (blah) {
//     blah.stop();
//   }

//   // disable the stop button
//   stopButton.disabled = true;
//   recordButton.disabled = false;

//   // tell the recorder to finish the recording (stop recording + encode the recorded audio)
//   recorder.finishRecording();

//   __log('Recording stopped');
// }

// function HandleAudio(blob: Blob, encoding: string) {

//   let url = URL.createObjectURL(blob);
//   let au = document.createElement('audio');
//   let li = document.createElement('li');
//   let link = document.createElement('a');

//   // add controls to the <audio> element
//   au.controls = true;
//   au.src = url;

//   // link the a element to the blob
//   link.href = url;
//   link.download = new Date().toISOString() + '.' + encoding;
//   link.innerHTML = link.download;

//   // add the new audio and a elements to the li element
//   li.appendChild(au);
//   li.appendChild(link);

//   // add the li element to the ordered list
//   recordingsList.appendChild(li);
// }

// // helper function
// function __log(e: string, data?: string) {
//   log.innerHTML += "\n" + e + " " + (data || '');
// }
