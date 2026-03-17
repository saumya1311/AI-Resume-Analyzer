export default function Footer() {
  return (
    <footer className="footer mt-12 mb-0">
      <div className="max-w-[1800px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a5b4fc] to-[#606beb]">
          ApplyWise
        </div>

        <div className="flex gap-6 text-gray-400 dark:text-gray-500 text-sm font-medium">
          <a href="https://x.com/saumya_aa" target="_blank" rel="noopener noreferrer" className="hover:text-[#606beb] transition-colors">Twitter</a>
          <a href="https://github.com/saumya1311" target="_blank" rel="noopener noreferrer" className="hover:text-[#606beb] transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/saumya-thakur-a3a9b125a/" target="_blank" rel="noopener noreferrer" className="hover:text-[#606beb] transition-colors">LinkedIn</a>
        </div>

        <div className="text-gray-400 dark:text-gray-500 text-xs font-medium">
          © {new Date().getFullYear()} ApplyWise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
