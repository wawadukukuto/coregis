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

  const [registered, setRegistered] = useState<Course[]>([]); //登録された授業を入れる

  const [selDay, selPeriod] = selected?.split("-") ?? [];
  const col = days.indexOf(selDay); // 何列目か（月=0〜土=5、見つからなければ-1）(days配列の何番目にあるかを見ている)
  const row = Number(selPeriod) - 1; // 何行目か（1限=0）

  const isIntensive = selected === "集中";
  // 候補を絞る
  const candidates = isIntensive
    ? intensives
    : courses.filter((c) => c.dWeekId === col + 1 && c.time === row + 1);

  const popupPos = isIntensive ? "bottom" : col < 3 ? "right" : "left";

  // 登録・削除の関数
  function toggleCourse(c: Course) {
    const isRegistered = registered.some((r) => r.id === c.id);

    if (isRegistered) {
      // 登録済みなら外す
      setRegistered(registered.filter((r) => r.id !== c.id));
    } else if (isIntensive) {
      // 集中はそのまま追加（複数OK）
      setRegistered([...registered, c]);
    } else {
      // 普通のマスは、同じコマの授業を外してから追加（1コマ1つ）
      setRegistered([
        ...registered.filter(
          (r) => !(r.dWeekId === c.dWeekId && r.time === c.time),
        ),
        c,
      ]);
    }
  }

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
              <li key={c.id} className="candidate">
                <CourseCard course={c} />
                <button onClick={() => toggleCourse(c)}>
                  {registered.some((r) => r.id === c.id) ? "外" : "入"}
                </button>
              </li>
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
            //条件に合うもの
            const course = registered.find(
              (r) => r.dWeekId === i + 1 && r.time === period,
            );
            return (
              <div
                key={key}
                className={`cell ${isOpen ? "active" : ""}`}
                onClick={() => setSelected(key)}
              >
                {course && <CourseCard course={course} />}
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
        >
          {registered
            .filter((r) => r.dWeekId === null)
            .map((r) => (
              <CourseCard key={r.id} course={r} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Timetable;
