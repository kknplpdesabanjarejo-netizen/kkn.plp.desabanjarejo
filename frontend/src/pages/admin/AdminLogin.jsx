import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex flex-col justify-between bg-emerald-950 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-canvas opacity-30" />
        <div className="relative flex items-center gap-2.5">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-800 text-amber-400"><GraduationCap className="h-5 w-5" /></span>
          <span className="font-display font-extrabold">KKN-PLP 66</span>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-display font-extrabold leading-tight">Pusat Kendali Admin</h1>
          <p className="mt-4 text-emerald-50/80 max-w-sm">Kelola tim, program, galeri, berita, dan seluruh bagian situs publik — dalam satu tempat.</p>
        </div>
        <p className="relative text-xs text-emerald-50/50">UIN K.H. Abdurrahman Wahid Pekalongan · 2026</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm" data-testid="admin-login-form">
          <span className="grid place-items-center h-12 w-12 rounded-xl bg-emerald-900 text-amber-400 mb-6"><Lock className="h-6 w-6" /></span>
          <h2 className="text-2xl font-display font-bold text-slate-900">Masuk ke Admin</h2>
          <p className="text-sm text-slate-500 mt-1">Akses dasbor administrator.</p>

          {error && <div className="mt-5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3" data-testid="login-error">{error}</div>}

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" data-testid="login-email" placeholder="anda@contoh.com" />
            </div>
            <div>
              <Label htmlFor="password">Kata Sandi</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5" data-testid="login-password" placeholder="••••••••" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-6 h-11 bg-emerald-900 hover:bg-emerald-800 rounded-lg font-semibold" data-testid="login-submit">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
