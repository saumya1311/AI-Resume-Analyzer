import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
  return (
    <Link to={`/resume/${id}`} className="resume-card group">
      <div className="flex flex-row items-center justify-between w-full mb-4">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-[#1a1a2e] tracking-tight">{companyName}</h3>
          <p className="text-[#6b7280] font-medium">{jobTitle}</p>
        </div>
        <div className="flex-shrink-0 scale-75 origin-right">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      
      <div className="relative flex-grow overflow-hidden rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 group-hover:border-gray-200">
        <img 
          src={imagePath}
          alt={`${companyName} resume`} 
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
};

export default ResumeCard;