import React, { useState } from "react";
import { registerWithEmail, loginWithEmail } from "@/infrastructure/firebase/authService";
import { LucideMail, LucideLock, LucideUserPlus, LucideLogIn, LucideTarget, LucideLoader2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "Usuário não encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/email-already-in-use": "Este e-mail já está em uso.",
  "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
  "auth/invalid-email": "E-mail inválido.",
  "auth/invalid-credential": "Credenciais inválidas.",
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const translateError = (code: string) => {
    return ERROR_MESSAGES[code] || "Ocorreu um erro inesperado. Tente novamente.";
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (err: any) {
      setError(translateError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#08060e] p-4 font-nunito">
      <div className="w-full max-w-md space-y-8 bg-[#100e1a] p-8 rounded-2xl border border-[#1e1a2e] shadow-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-3 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/20">
            <LucideTarget className="w-10 h-10 text-[#c8a96e]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#f0e6d3] uppercase tracking-tighter">
              {isLogin ? "Santuário Orokin" : "Nova Iniciação"}
            </h1>
            <p className="text-[#8a7a9b] font-medium">
              {isLogin ? "Entre para ver seu progresso" : "Comece sua jornada no Void"}
            </p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#c8a96e] uppercase ml-1">E-mail</label>
            <div className="relative group">
              <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a7a9b]/30 group-focus-within:text-[#4cc9ff] transition-colors" />
              <input
                type="email"
                required
                className="w-full bg-[#08060e] border border-[#1e1a2e] rounded-xl py-3 pl-11 pr-4 text-[#f0e6d3] placeholder:text-[#8a7a9b]/20 focus:outline-none focus:ring-2 focus:ring-[#4cc9ff]/20 focus:border-[#4cc9ff] transition-all"
                placeholder="tenno@void.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#c8a96e] uppercase ml-1">Senha</label>
            <div className="relative group">
              <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a7a9b]/30 group-focus-within:text-[#4cc9ff] transition-colors" />
              <input
                type="password"
                required
                className="w-full bg-[#08060e] border border-[#1e1a2e] rounded-xl py-3 pl-11 pr-4 text-[#f0e6d3] placeholder:text-[#8a7a9b]/20 focus:outline-none focus:ring-2 focus:ring-[#4cc9ff]/20 focus:border-[#4cc9ff] transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-[#c8a96e] uppercase ml-1">Confirmar Senha</label>
              <div className="relative group">
                <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a7a9b]/30 group-focus-within:text-[#4cc9ff] transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-[#08060e] border border-[#1e1a2e] rounded-xl py-3 pl-11 pr-4 text-[#f0e6d3] placeholder:text-[#8a7a9b]/20 focus:outline-none focus:ring-2 focus:ring-[#4cc9ff]/20 focus:border-[#4cc9ff] transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center animate-in fade-in zoom-in duration-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-[#c8a96e] disabled:bg-[#c8a96e]/5 disabled:text-[#c8a96e]/20 disabled:border disabled:border-[#c8a96e]/10 disabled:shadow-none text-[#08060e] font-black py-4 rounded-2xl shadow-[0_20px_40px_rgba(200,169,110,0.15)] hover:shadow-[0_25px_50px_rgba(200,169,110,0.25)] hover:-translate-y-1 transition-all active:scale-95 overflow-hidden flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            {loading ? (
              <LucideLoader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              <>
                Entrar <LucideLogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                Iniciar <LucideUserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-[#8a7a9b] hover:text-[#c8a96e] font-bold text-sm transition-colors"
          >
            {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Entre agora"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
