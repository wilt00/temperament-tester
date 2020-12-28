import React from "react";
import "./App.css";
import ToneRow from "./ToneRow";
import { Temperament } from "./tone";

function App() {
  const { current: ac } = React.useRef(
    new window.AudioContext({ latencyHint: "interactive" })
  );

  const [temperament, setTemperament] = React.useState(Temperament.TwelveTET);
  // const [waveType, setWaveType] = React.useState<OscillatorType>("sine");

  return (
    <div className="App">
      <header className="App-header">
        <ToneRow context={ac} temperament={temperament} />
        <select
          onChange={(e) => {
            //@ts-ignore
            setTemperament(e.target.value);
          }}
        >
          {Object.keys(Temperament).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {/* <select
          onChange={(e) => {
            // @ts-ignore
            setWaveType(e.target.value);
          }}
        >
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
        </select> */}
      </header>
    </div>
  );
}

export default App;
