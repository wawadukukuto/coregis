import type { Course } from "../types";

type Props = {
  course: Course; //受け取るものの形を決める
};

function CourseCard({ course }: Props) {
  return (
    <div className="course-card">
      {course.name}
      <div className="course-eval">{course.evaluation.join(" / ")}</div>
    </div>
  );
}
export default CourseCard;
