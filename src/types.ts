export type Course = {
  id: string;
  name: string;
  course: string[];        // 必修コース
  dWeekId: number | null;  // 曜日（1=月〜6=土、null=集中？）
  time: number | null;     
  evaluation: string[];    
  outline: string;        
  teature: string;        
  element: string[];       
};