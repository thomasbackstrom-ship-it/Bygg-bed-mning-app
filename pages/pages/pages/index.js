import { useState, useEffect } from "react";

const courses = [
  "Bygg och anläggning 1",
  "Husbyggnad 1",
  "Måleri 1",
  "Plåt 1"
];

const criteriaMap = {
  "Bygg och anläggning 1": [0, 1, 3, 4, 5],
  "Husbyggnad 1": [0, 1, 2, 5],
  "Måleri 1": [2, 1, 6],
  "Plåt 1": [3, 1, 5]
};

const criteria = [
  "Yrkeskunskaper",
  "Verktyg & material",
  "Noggrannhet & kvalitet",
  "Arbetsmiljö & säkerhet",
  "Samarbete & ansvar",
  "Problemlösning",
  "Yrkesförståelse"
];

export default function Home() {
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

  const importStudents = () => {
    const list = bulkInput.split("\\n").map(s => s.trim()).filter(Boolean);
    setStudents(list);
    localStorage.setItem("elevlista", JSON.stringify(list));
  };

