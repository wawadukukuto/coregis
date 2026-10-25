import type {Course} from '../types';

type Props = {
    course:Course;      //受け取るものの形を決める
};                          

function CourseCard({course}:Props){
    return(
        <li>{course.name}</li>
    );
}
export default CourseCard;