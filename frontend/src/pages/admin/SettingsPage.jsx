import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

const FIELDS = [
  ["siteName", "Nama Situs", "text"],
  ["university", "Universitas", "text"],
  ["year", "Tahun", "text"],
  ["tagline", "Tagline", "text"],
  ["description", "Deskripsi", "textarea"],
  ["instagram", "URL Instagram", "text"],
  ["tiktok", "URL TikTok", "text"],
  ["youtube", "URL YouTube", "text"],
  ["whatsapp", "Nomor WhatsApp", "text"],
  ["email", "Email Kontak", "text"],
];

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings").then((r) => setForm(r.data.data));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/settings", form);
      toast.success("Pengaturan berhasil disimpan");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (!form)
    return <div className="grid place-items-center py-24"><Loader2 className="h-8 w-8 animate-spin text-emerald-800" /></div>;

  return (
    <div className="max-w-2xl" data-testid="settings-page">
      <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">Pengaturan Situs</h1>
      <p className="text-slate-500 text-sm mb-6">Perbarui identitas situs dan kanal kontak. Perubahan langsung tampil di situs publik.</p>
      <form onSubmit={save} className="rounded-2xl border border-slate-100 bg-white p-6 space-y-5">
        {FIELDS.map(([name, label, type]) => (
          <div key={name}>
            <Label htmlFor={name}>{label}</Label>
            <div className="mt-1.5">
              {type === "textarea" ? (
                <Textarea value={form[name] || ""} onChange={(e) => setForm({ ...form, [name]: e.target.value })} rows={3} data-testid={`settings-${name}`} />
              ) : (
                <Input value={form[name] || ""} onChange={(e) => setForm({ ...form, [name]: e.target.value })} data-testid={`settings-${name}`} />
              )}
            </div>
          </div>
        ))}
        <Button type="submit" disabled={saving} className="bg-emerald-900 hover:bg-emerald-800 gap-1.5" data-testid="settings-save">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Simpan Perubahan</>}
        </Button>
      </form>
    </div>
  );
}
