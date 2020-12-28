import React from "react";
import ToneKey from "./ToneKey";
import "./ToneRow.css";
import { Temperament, Frequencies } from "./tone";

interface Props {
  context: AudioContext;
  temperament: Temperament;
  // waveType: OscillatorType;
}

const SCALE = [
  "A",
  "A#/B♭",
  "B",
  "C",
  "C#/D♭",
  "D",
  "D#/E♭",
  "E",
  "F",
  "F#/G♭",
  "G",
  "G#/A♭",
  "A",
];
const DESCRIPTION = [
  "Base",
  "Minor Second",
  "Major Second",
  "Minor Third",
  "Major Third",
  "Perfect Fourth",
  "Tritone",
  "Perfect Fifth",
  "Minor Sixth",
  "Major Sixth",
  "Minor Seventh",
  "Major Seventh",
  "Octave",
];

function ToneRow({ context, temperament }: Props) {
  const frequencies = Frequencies[temperament];
  return (
    <div className="ToneRow">
      {frequencies.map((f, i) => (
        <div key={i}>
          <div>{SCALE[i]}</div>
          <div className="Description">{DESCRIPTION[i]}</div>
          <ToneKey context={context} freq={f} />
        </div>
      ))}
      {/* <button>Stop all</button> */}
    </div>
  );
}

export default ToneRow;
