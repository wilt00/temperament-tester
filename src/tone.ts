export enum Temperament {
  TwelveTET = "TwelveTET",
  Pythagorean = "Pythagorean",
  TestScale = "TestScale",
}

export const Frequencies = {
  // TwelveTET: [
  //   440,
  //   466.16,
  //   493.88,
  //   523.25,
  //   554.37,
  //   587.33,
  //   622.25,
  //   659.25,
  //   698.46,
  //   739.99,
  //   783.99,
  //   830.61,
  //   880,
  // ],
  [Temperament.TwelveTET]: Array.from(
    { length: 13 },
    (_, i) => 440 * Math.pow(2, 1 / 12) ** i
  ),
  [Temperament.Pythagorean]: [
    1,
    256 / 243,
    9 / 8,
    32 / 27,
    81 / 64,
    4 / 3,
    729 / 512,
    3 / 2,
    128 / 81,
    27 / 16,
    16 / 9,
    243 / 128,
    2,
  ].map((r) => 440 * r),
  [Temperament.TestScale]: [
    401,
    402,
    403,
    404,
    405,
    406,
    407,
    408,
    409,
    410,
    411,
    412,
    413,
  ],
};

export interface ToneOptions {
  waveType?: OscillatorType;
}

export class Tone {
  private ctx: AudioContext;
  private options: ToneOptions;
  // private freq: number;
  private osc: OscillatorNode;
  private atk: GainNode;
  private squareGain: GainNode;
  private playing: boolean;

  constructor(ctx: AudioContext, freq: number, options?: ToneOptions) {
    this.ctx = ctx;
    this.options = options || {};

    this.osc = ctx.createOscillator();
    this.osc.frequency.value = freq;
    this.osc.type = this.options.waveType || "triangle";

    this.squareGain = ctx.createGain();
    this.squareGain.gain.value = this.osc.type === "square" ? 0.3 : 1;

    this.atk = this.ctx.createGain();
    this.osc.connect(this.squareGain);
    this.squareGain.connect(this.atk);
    this.atk.connect(this.ctx.destination);

    this.playing = false;
  }

  setFreq(newFreq: number) {
    if (this.playing) {
      this.osc.frequency.setValueAtTime(
        this.osc.frequency.value,
        this.ctx.currentTime + 0.05
      );
      this.osc.frequency.exponentialRampToValueAtTime(
        newFreq,
        this.ctx.currentTime + 0.1
      );
    } else {
      this.osc.frequency.value = newFreq;
    }
  }

  setType(newType: OscillatorType) {
    const newGain = newType === "square" ? 0.3 : 1;
    if (this.playing) {
      this.squareGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.squareGain.gain.exponentialRampToValueAtTime(
        newGain,
        this.ctx.currentTime + 0.1
      );
    } else {
      this.squareGain.gain.value = newGain;
    }
    this.osc.type = newType;
  }

  isPlaying() {
    return this.playing;
  }

  playFor(time: number) {
    this.start();
    this.stop(time);
  }

  start() {
    this.playing = true;
    const now = this.ctx.currentTime;
    this.atk.gain.setValueAtTime(0.001, now);
    this.atk.gain.exponentialRampToValueAtTime(1, now + 0.1);
    this.osc.start(now);
  }

  stop(waitTime?: number) {
    this.playing = false;
    const now = this.ctx.currentTime;
    const stopTime = now + 0.5 + (waitTime || 0);
    // exponentialRampToValueAtTime starts at the end of the previous event
    // so we need to give it a previous event in the future from when we schedule it
    // so there's no audible gap
    this.atk.gain.setValueAtTime(
      this.atk.gain.value,
      this.ctx.currentTime + 0.05
    );
    this.atk.gain.exponentialRampToValueAtTime(0.0001, stopTime);
    this.osc.stop(stopTime);
  }
}
