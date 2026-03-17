import { useState, useEffect } from "react";
import ResumeCard from "~/components/ResumeCard";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { resumes } from "~/../constants";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ApplyWise" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

interface TypewriterLine {
  text: string;
  className?: string;
}

const Typewriter = ({ lines, speed = 150, pause = 4000 }: { lines: TypewriterLine[]; speed?: number; pause?: number }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isDone) {
      const resetTimeout = setTimeout(() => {
        setLineIndex(0);
        setCharIndex(0);
        setIsDone(false);
      }, pause);
      return () => clearTimeout(resetTimeout);
    }

    if (charIndex < lines[lineIndex].text.length) {
      const charTimeout = setTimeout(() => {
        setCharIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(charTimeout);
    } else if (lineIndex < lines.length - 1) {
      const lineTimeout = setTimeout(() => {
        setLineIndex(prev => prev + 1);
        setCharIndex(0);
      }, speed * 2);
      return () => clearTimeout(lineTimeout);
    } else {
      setIsDone(true);
    }
  }, [lineIndex, charIndex, isDone, lines, speed, pause]);

  return (
    <span className="inline-block">
      {lines.map((line, idx) => (
        <span key={idx} className="inline">
          <span className={`${line.className || ""} ${idx === lineIndex && !isDone ? "typewriter-cursor" : ""}`}>
            {idx < lineIndex ? line.text : idx === lineIndex ? line.text.substring(0, charIndex) : ""}
          </span>
          {idx < lines.length - 1 && idx < lineIndex && <>&nbsp;</>}
          {idx === lines.length - 1 && isDone && <span className="typewriter-cursor" />}
        </span>
      ))}
    </span>
  );
};

export default function Home() {
  return (
    <main className="bg-[#d9ecfe] min-h-screen pt-0">
      <Navbar />

      <section className="main-section px-4 sm:px-10">
        <div className="page-heading py-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#33334d] mb-4">
            <Typewriter 
              lines={[
                { text: "Resume Check." },
                { 
                  text: "Stress Less.", 
                  className: "font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500" 
                }
              ]}
            />
          </h1>
        </div>

        <div className="resumes-section mt-8 animate-reveal delay-500">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}