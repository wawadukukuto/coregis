import "./Timetable.css";
import { useState, type CSSProperties } from "react";

import coursesData from "../data/courses.json";
import type { Course } from "../types";
import CourseCard from "./CourseCard";

const courses: Course[] = coursesData;
const intensives = courses.filter((c) => c.dWeekId === null);

const days = ["月", "火", "水", "木", "金", "土"];
const periods = [1, 2, 3, 4, 5];

function Timetable() {
  const [selected, setSelected] = useState<string | null>(null); // マスが押されているかを記憶
  //↑setSelectedがselctedの中身を変更する関数的役割

  const [selDay, selPeriod] = selected?.split("-") ?? [];
  const col = days.indexOf(selDay); // 何列目か（月=0〜土=5、見つからなければ-1）(days配列の何番目にあるかを見ている)
  const row = Number(selPeriod) - 1; // 何行目か（1限=0）

  const isIntensive = selected === "集中";
  // 候補を絞る
  const candidates = isIntensive
    ? intensives
    : courses.filter((c) => c.dWeekId === col + 1 && c.time === row + 1);

  const popupPos = isIntensive ? "bottom" : col < 3 ? "right" : "left";
  return (
    <div className="timetable">
      {/*背景*/}
      {selected && (
        <div className="backdrop" onClick={() => setSelected(null)} />
      )}
      {/* ポップアップ */}
      {selected && (col >= 0 || isIntensive) && (
        <div
          className={`popup ${popupPos}`}
          style={{ "--col": col, "--row": row } as CSSProperties}
        >
          <button onClick={() => setSelected(null)}>❌</button>
          <p>
            {isIntensive ? "集中" : selected}：{candidates.length}件
          </p>
          <ul className="candidates">
            {candidates.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </ul>
        </div>
      )}
      {/* 月から土 */}
      {periods.map((period) => (
        <div key={period} className="row">
          <div className="period">{period}限</div>
          {days.map((day, i) => {
            // 回数省略の変数指定
            const key = `${day}-${period}`;
            // keyとselectedが同じか調べてその結果をisOpenに入れる
            const isOpen = selected === key;
            return (
              <div
                key={key}
                className={`cell ${isOpen ? "active" : ""}`}
                onClick={() => setSelected(key)}
              >
                {day}
                {period}
              </div>
            );
          })}
        </div>
      ))}
      {/* 集中講義 */}
      <div className="intensive">
        <div className="period">集中</div>
        <div
          className={`cell intensive-cell ${selected === "集中" ? "active" : ""}`}
          onClick={() => setSelected("集中")}
        ></div>
      </div>
    </div>
  );
}

export default Timetable;
