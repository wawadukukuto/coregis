import "./Timetable.css";
import { useState } from "react";

const days = ["月", "火", "水", "木", "金", "土"];
const periods = [1, 2, 3, 4, 5];

function Timetable() {
  const [selected, setSelected] = useState<string | null>(null); // マスが押されているかを記憶
  const selectedDay = selected?.split("-")[0];
  const isFirstHalf = ["月", "火", "水"].includes(selectedDay ?? "");
  
  return (
    <div className="timetable">
      {selected && (
        <>
          <div className ="backdrop" onClick={() => setSelected(null)}/>
          <div className={`popup ${isFirstHalf ? "right" : "left"}`}>
            <button onClick={() => setSelected(null)}>❌</button>
            <p>選択中：{selected}</p>
          </div>
        </>
      )}
      {periods.map((period) => (
        <div key={period} className="row">
          <div className="period">{period}限</div>
          {days.map((day) => (
            <div
              key={`${day}-${period}`}
              className="cell"
              onClick={() => setSelected(`${day}-${period}`)}
            >
              {day}
              {period}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Timetable;
