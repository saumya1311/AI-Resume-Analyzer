import ResumeCard from "~/components/ResumeCard";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "~/../constants";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.png')] bg-cover min-h-screen pt-0">
      <Navbar />

      <section className="main-section px-4 sm:px-10">
        <div className="page-heading py-20">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#33334d] mb-4">
            Track Your Applications & Resume Ratings
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-500 font-medium tracking-tight">
            Review your submissions and check AI-powered feedback.
          </h2>
        </div>

        <div className="resumes-section mt-8">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      </section>
    </main>
  );
}