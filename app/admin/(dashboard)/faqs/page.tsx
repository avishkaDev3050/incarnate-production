"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function ManageFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<any>(null);

  const fetchFaqs = async () => {
    const res = await fetch("/api/admin/faqs");
    const json = await res.json();
    if (json.success) setFaqs(json.data);
    setIsLoading(false);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      id: isEditing?.id,
      question: formData.get("question"),
      answer: formData.get("answer"),
      category: "General"
    };

    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      body: JSON.stringify(data)
    });

    if (res.ok) {
      Swal.fire("Saved!", "", "success");
      setIsEditing(null);
      fetchFaqs();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
    fetchFaqs();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Manage FAQs</h1>
        <button onClick={() => setIsEditing({})} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold">
          <Plus size={18} /> Add FAQ
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="mb-10 bg-white p-6 rounded-4xl border border-blue-100 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-700">{isEditing.id ? "Edit FAQ" : "New FAQ"}</h2>
            <button type="button" onClick={() => setIsEditing(null)}><X size={20}/></button>
          </div>
          <input name="question" defaultValue={isEditing.question} placeholder="Question" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500" required />
          <textarea name="answer" defaultValue={isEditing.answer} placeholder="Answer" rows={4} className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500" required />
          <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
            <Save size={18} /> Save FAQ
          </button>
        </form>
      )}

      <div className="bg-white rounded-4xl border border-slate-100 shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Question</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={2} className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" /></td></tr>
            ) : faqs.map((faq: any) => (
              <tr key={faq.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-700">{faq.question}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => setIsEditing(faq)} className="p-2 text-slate-400 hover:text-amber-600"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(faq.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}