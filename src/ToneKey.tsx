import React from "react";
import { Tone } from "./tone";

interface Props {
  context: AudioContext;
  freq: number;
  // waveType: OscillatorType;
}

const STOP = "⏹️";
const PLAY = "▶";

function ToneKey({ context, freq }: Props) {
  const [tone, setTone] = React.useState(new Tone(context, freq));
  const [title, setTitle] = React.useState(`${freq.toFixed(2)}Hz - ${PLAY}`);

  React.useEffect(() => {
    tone.setFreq(freq);
    setTitle(`${freq.toFixed(2)}Hz - ${tone.isPlaying() ? STOP : PLAY}`);
  }, [tone, freq]);

  // React.useEffect(() => {
  //   tone.setType(waveType);
  // }, [tone, waveType]);

  const onClick = () => {
    if (tone.isPlaying()) {
      tone.stop();
      setTone(new Tone(context, freq));
    } else {
      tone.start();
      setTitle(`${freq.toFixed(2)}Hz - ${STOP}`);
    }
  };

  return (
    <button
      onClick={onClick} /* onDoubleClick={() => tone.setFreq(freq * 2)} */
    >
      {title}
    </button>
  );
}

export default ToneKey;
