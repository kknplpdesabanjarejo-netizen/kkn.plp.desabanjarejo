import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

const FIELDS = [
  ["siteName", "Site Name", "text"],
  ["university", "University", "text"],
  ["year", "Year", "text"],
  ["tagline", "Tagline", "text"],
  ["description", "Description", "textarea"],
  ["instagram", "Instagram URL", "text"],
  ["tiktok", "TikTok URL", "text"],
  ["youtube", "YouTube URL", "text"],
  ["whatsapp", "WhatsApp Number", "text"],
  ["email", "Contact Email", "text"],
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
      toast.success("Settings saved");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!form)
    return <div className="grid place-items-center py-24"><Loader2 className="h-8 w-8 animate-spin text-emerald-800" /></div>;

  return (
    <div className="max-w-2xl" data-testid="settings-page">
      <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">Website Settings</h1>
      <p className="text-slate-500 text-sm mb-6">Update your site identity and contact channels. Changes reflect immediately on the public site.</p>
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
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Changes</>}
        </Button>
      </form>
    </div>
  );
}
