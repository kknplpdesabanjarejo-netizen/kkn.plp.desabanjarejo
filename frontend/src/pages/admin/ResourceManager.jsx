import { useState, useRef } from "react";
import { useResource } from "@/lib/useApi";
import { api, formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, Upload, X, ImageIcon, Search, Inbox } from "lucide-react";

function slugify(t) {
  return (t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ImageField({ value, onChange, testId }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(res.data.data.url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" data-testid={`${testId}-input`} onChange={(e) => upload(e.target.files[0])} />
      {value ? (
        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-slate-200 group">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange("")} className="absolute top-1.5 right-1.5 bg-slate-950/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`${testId}-remove`}>
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} data-testid={`${testId}-btn`} className="w-40 h-40 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 grid place-items-center text-slate-400 transition-colors">
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-center"><Upload className="h-6 w-6 mx-auto" /><span className="text-xs mt-1 block">Upload</span></div>}
        </button>
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  const tid = `field-${field.name}`;
  if (field.type === "textarea")
    return <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={field.rows || 3} data-testid={tid} />;
  if (field.type === "number")
    return <Input type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} data-testid={tid} />;
  if (field.type === "switch")
    return <Switch checked={value !== false} onCheckedChange={onChange} data-testid={tid} />;
  if (field.type === "image")
    return <ImageField value={value} onChange={onChange} testId={tid} />;
  if (field.type === "tags")
    return <Textarea value={Array.isArray(value) ? value.join("\n") : value || ""} onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} rows={3} placeholder="One item per line" data-testid={tid} />;
  if (field.type === "select")
    return (
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger data-testid={tid}><SelectValue placeholder="Select..." /></SelectTrigger>
        <SelectContent>{field.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    );
  return <Input value={value || ""} onChange={(e) => onChange(e.target.value)} data-testid={tid} />;
}

export default function ResourceManager({ config }) {
  const { data, loading, refetch } = useResource(config.path);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [query, setQuery] = useState("");

  const openNew = () => {
    const init = {};
    config.fields.forEach((f) => {
      if (f.default !== undefined) init[f.name] = f.default;
      else if (f.type === "switch") init[f.name] = true;
    });
    init.order = data.length + 1;
    setForm(init);
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setForm({ ...item });
    setEditing(item);
    setDialogOpen(true);
  };

  const setField = (name, val) => setForm((f) => ({ ...f, [name]: val }));

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (config.path === "news" && !payload.slug && payload.title) payload.slug = slugify(payload.title);
    setSaving(true);
    try {
      if (editing) await api.put(`/${config.path}/${editing.id}`, payload);
      else await api.post(`/${config.path}`, payload);
      toast.success(`${config.singular} ${editing ? "updated" : "created"}`);
      setDialogOpen(false);
      refetch();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    try {
      await api.delete(`/${config.path}/${deleteTarget.id}`);
      toast.success(`${config.singular} deleted`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const imageField = config.fields.find((f) => f.type === "image");
  const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
  const filtered = query
    ? sorted.filter((it) => config.columns.some((c) => String(it[c] || "").toLowerCase().includes(query.toLowerCase())))
    : sorted;

  return (
    <div data-testid={`resource-${config.path}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">{config.label}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{data.length} {data.length === 1 ? "item" : "items"}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="pl-9" data-testid={`${config.path}-search`} />
          </div>
          <Button onClick={openNew} className="bg-emerald-900 hover:bg-emerald-800 gap-1.5 shrink-0" data-testid={`${config.path}-add`}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white text-center" data-testid={`${config.path}-empty`}>
          <Inbox className="h-10 w-10 text-slate-300" />
          <p className="mt-3 font-display font-semibold text-slate-700">No {config.label} yet</p>
          <p className="text-sm text-slate-400 mt-1">Click "Add" to create your first {config.singular.toLowerCase()}.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  {imageField && <th className="px-4 py-3 font-medium w-16"></th>}
                  {config.columns.map((c) => <th key={c} className="px-4 py-3 font-medium capitalize">{c}</th>)}
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const active = item.isActive !== false && item.isPublished !== false;
                  const hasStatus = "isActive" in item || "isPublished" in item;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60" data-testid={`row-${item.id}`}>
                      {imageField && (
                        <td className="px-4 py-3">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden grid place-items-center text-slate-300">
                            {item[imageField.name] ? <img src={item[imageField.name]} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="h-4 w-4" />}
                          </div>
                        </td>
                      )}
                      {config.columns.map((c) => <td key={c} className="px-4 py-3 text-slate-700 max-w-[200px] truncate">{String(item[c] ?? "—")}</td>)}
                      <td className="px-4 py-3">
                        {hasStatus ? <Badge variant={active ? "default" : "secondary"} className={active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>{active ? "Active" : "Hidden"}</Badge> : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(item)} data-testid={`edit-${item.id}`}><Pencil className="h-4 w-4 text-slate-500" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(item)} data-testid={`delete-${item.id}`}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid={`${config.path}-dialog`}>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${config.singular}` : `New ${config.singular}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            {config.fields.map((f) => (
              <div key={f.name} className={f.type === "switch" ? "flex items-center justify-between" : ""}>
                <Label htmlFor={f.name} className="text-sm">{f.label}{f.required && <span className="text-red-500"> *</span>}</Label>
                <div className={f.type === "switch" ? "" : "mt-1.5"}>
                  <FieldInput field={f} value={form[f.name]} onChange={(v) => setField(f.name, v)} />
                </div>
              </div>
            ))}
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-emerald-900 hover:bg-emerald-800" data-testid={`${config.path}-save`}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent data-testid="delete-confirm-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The item will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} className="bg-red-600 hover:bg-red-700" data-testid="confirm-delete">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
