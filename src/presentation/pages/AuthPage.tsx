import React, { useState } from "react";
import { registerWithEmail, loginWithEmail } from "@/infrastructure/firebase/authService";
import { LucideMail, LucideLock, LucideUserPlus, LucideLogIn, LucideShieldCheck } from "lucide-react";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4 font-nunito">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <LucideShieldCheck className="w-10 h-10 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-100 uppercase tracking-tighter">
              {isLogin ? "Bem-vindo de volta" : "Criar Conta"}
            </h1>
            <p className="text-zinc-400 font-medium">
              {isLogin ? "Entre para acompanhar seu progresso" : "Comece sua jornada de maestria"}
            </p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">E-mail</label>
            <div className="relative group">
              <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Senha</label>
            <div className="relative group">
              <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="password"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Confirmar Senha</label>
              <div className="relative group">
                <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
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
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black py-4 rounded-xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLogin ? (
              <>
                Entrar <LucideLogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                Criar Conta <LucideUserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
            className="text-zinc-500 hover:text-indigo-400 font-bold text-sm transition-colors"
          >
            {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Entre agora"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
