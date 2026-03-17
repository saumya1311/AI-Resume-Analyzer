import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { supabase } from "~/lib/supabase";
import Navbar from "~/components/Navbar";

export const meta = () => ([
    { title: "ApplyWise | Auth" },
    {name: "description", content: "Login or register to access your personalized dashboard and manage your resume analysis results."}
])

const Auth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const location = useLocation();
    const next = location.search.includes('next=') ? location.search.split('next=')[1] : '/';
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) navigate(next);
        };
        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) navigate(next);
        });

        return () => subscription.unsubscribe();
    }, [navigate, next]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setErrorMsg("Check your email for the confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error: any) {
            setErrorMsg(error.message || "An error occurred during authentication.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setErrorMsg("");
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}${next}`
                }
            });
            if (error) throw error;
        } catch (error: any) {
            setErrorMsg(error.message || "Google login failed.");
            setIsLoading(false);
        }
    };

    return (
        <main className="bg-[#d9ecfe] min-h-[100vh]">
            <Navbar />
            <div className="flex items-center justify-center p-4 min-h-[90vh]">
                <div className="gradient-border shadow-2xl w-full max-w-md bg-white rounded-3xl overflow-hidden p-[2px]">
                    <section className="flex flex-col gap-6 bg-white rounded-3xl p-8 sm:p-10 h-full w-full">
                        <div className="flex flex-col items-center gap-2 text-center mb-4">
                            <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors self-start mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
                            <h2 className="text-sm font-medium text-gray-500">
                                {isSignUp ? "Sign up to track your resume apps" : "Log In to Continue Your Job Journey"}
                            </h2>
                        </div>
                        
                        {errorMsg && (
                            <div className={`p-3 rounded-lg text-sm text-center ${errorMsg.includes('Check your email') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700">Email</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-gray-900" 
                                    placeholder="you@example.com"
                                    required 
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-gray-900" 
                                    placeholder="••••••••"
                                    required 
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">{isSignUp ? "Signing up..." : "Logging in..."}</span>
                                ) : (
                                    <span>{isSignUp ? "Sign Up" : "Log In"}</span>
                                )}
                            </button>
                        </form>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <button 
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full py-3 flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold shadow-sm active:scale-[0.98] transition-all disabled:opacity-70"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>

                        <p className="text-center text-sm text-gray-600 mt-2">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button 
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)} 
                                className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                {isSignUp ? "Log In" : "Sign Up"}
                            </button>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Auth
