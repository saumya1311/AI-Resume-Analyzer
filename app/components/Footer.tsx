export default function Footer() {
  return (
    <footer className="w-full bg-white/90 backdrop-blur-md border-t border-gray-100 py-6 mt-12 mb-0 relative shadow-[0_-2px_15px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1800px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          ApplyWise
        </div>

        <div className="flex gap-6 text-gray-400 text-sm font-medium">
          <a href="https://x.com/saumya_aa" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">Twitter</a>
          <a href="https://github.com/saumya1311" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/saumya-thakur-a3a9b125a/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">LinkedIn</a>
        </div>

        <div className="text-gray-400 text-xs font-medium">
          © {new Date().getFullYear()} ApplyWise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
