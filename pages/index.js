import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ✅ KURSER ÅK 1 (GY25 – FÖRENKLAD STRUKTUR)
const courses = [
  "Bygg och anläggning 1",
  "Husbyggnad 1",
  "Måleri 1",
  "Plåt 1"
];

// ✅ Koppling kriterier → kurs
const criteriaMap = {
  "Bygg och anläggning 1": [0,1,3,4,5],
  "Husbyggnad 1": [0,1,2,5],
  "Måleri 1": [2,1,6],
  "Plåt 1": [3,1,5]
};

const criteria = [
  "Yrkeskunskaper",
  "Verktyg & material",
  "Noggrannhet & kvalitet",
  "Arbetsmiljö & säkerhet",
  "Samarbete & ansvar",
  "Problemlösning",
  "Yrkesförståelse",
];

export default function App() {
  const [students, setStudents] = useState([]);
  const [bulkInput, setBulkInput] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Bygg och anläggning 1");
  const [scores, setScores] = useState(Array(criteria.length).fill(0));
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const s = localStorage.getItem("elevlista");
    const d = localStorage.getItem("bedomningar");
    if (s) setStudents(JSON.parse(s));
    if (d) setSaved(JSON.parse(d));
  }, []);

  // ✅ MASSIMPORT
  const importStudents = () => {
    const list = bulkInput.split("\\n").map(s => s.trim()).filter(Boolean);
").map(s => s.trim()).filter(Boolean);
    setStudents(list);
    localStorage.setItem("elevlista", JSON.stringify(list));
  };

  const handleScore = (i,val) => {
    const s = [...scores];
    s[i]=val;
    setScores(s);
  };

  // ✅ BERÄKNING KURS
  const calcCourseScore = () => {
    const indexes = criteriaMap[selectedCourse];
    return indexes.map(i => scores[i]).reduce((a,b)=>a+b,0);
  };

  const maxCourseScore = criteriaMap[selectedCourse].length * 3;


  const courseGrade = () => {
    const score = calcCourseScore();
    if(score >= maxCourseScore * 0.7) return "A";
    if(score >= maxCourseScore * 0.5) return "C";
    if(score > 0) return "E";
    return "-";
  };

  // 🚨 VARNINGSSYSTEM
  const warning = () => {
    const score = calcCourseScore();
    if(score < maxCourseScore * 0.4) return "🔴 Risk för F/E";
    if(score < maxCourseScore * 0.5) return "🟡 På gränsen";
    return "🟢 Stabil nivå";
  };


  // 🏗️ YRKE
  const getProfession = () => {
    const t = (scores[0]||0)+(scores[1]||0)+(scores[5]||0);
    const m = (scores[2]||0)+(scores[6]||0);
    const p = (scores[3]||0)+(scores[1]||0);
    const max=Math.max(t,m,p);
    if(max===t) return "Trä";
    if(max===m) return "Måleri";
    if(max===p) return "Plåt";
  };


  // 💾 SPARA
  const save = () => {
    const entry = {
      student: selectedStudent,
      course: selectedCourse,
      grade: courseGrade(),
      score: calcCourseScore(),
      profession: getProfession()
    };
    const updated=[...saved, entry];
    setSaved(updated);
    localStorage.setItem("bedomningar", JSON.stringify(updated));
  };

  // 📤 BETYGSRAPPORT (CSV)
  const exportReport = () => {
    const header = "Elev,Kurs,Poäng,Betyg,Yrke
";
    const rows = saved.map(s => `${s.student},${s.course},${s.score},${s.grade},${s.profession}`).join("
");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Gy25_betygsrapport.csv";
    a.click();
  };

  return (
    <div className="p-4 grid gap-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Gy25 Bedömningsapp (Mobil)</h1>


      {/* INSTALL TIPS */}
      <div className="text-xs bg-blue-100 p-2 rounded">
        Tips: Lägg till på hemskärmen → fungerar som mobilapp
      </div>


      {/* IMPORT */}
      <Card><CardContent>
        <Textarea value={bulkInput} onChange={(e)=>setBulkInput(e.target.value)} placeholder="Klistra elevlista"/>
        <Button onClick={importStudents}>Lägg in klass</Button>
      </CardContent></Card>

      {/* VAL */}
      <Select onValueChange={setSelectedStudent}>
        <SelectTrigger><SelectValue placeholder="Elev"/></SelectTrigger>
        <SelectContent>
          {students.map((s,i)=>(<SelectItem key={i} value={s}>{s}</SelectItem>))}
        </SelectContent>
      </Select>

      <Select onValueChange={setSelectedCourse} defaultValue={selectedCourse}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {courses.map((c,i)=>(<SelectItem key={i} value={c}>{c}</SelectItem>))}
        </SelectContent>
      </Select>

      {/* KRITERIER */}
      {criteria.map((c,i)=> (
        <div key={i} className={`flex justify-between p-2 border ${criteriaMap[selectedCourse].includes(i)?"bg-white":"bg-gray-100 opacity-40"}`}>
          {c}
          <div className="flex gap-1">
            <Button size="sm" onClick={()=>handleScore(i,1)}>E</Button>
            <Button size="sm" onClick={()=>handleScore(i,2)}>C</Button>
            <Button size="sm" onClick={()=>handleScore(i,3)}>A</Button>
          </div>
        </div>
      ))}


      {/* RESULTAT */}
      <Card><CardContent>
        <div>Kursbetyg: <strong>{courseGrade()}</strong></div>
        <div>Status: {warning()}</div>
        <div>Yrkesprofil: {getProfession()}</div>
      </CardContent></Card>

      <div className="flex gap-2">
        <Button onClick={save}>Spara</Button>
        <Button onClick={exportReport} variant="outline">Export rapport</Button>
      </div>

      {/* ÖVERSIKT */}
      <Card><CardContent>
        <div className="font-bold">Betygsrapport</div>
        {saved.map((s,i)=>(
          <div key={i} className="text-sm">
            {s.student} – {s.course}: {s.grade} ({s.profession})
          </div>
        ))}
      </CardContent></Card>
    </div>
  );
}
