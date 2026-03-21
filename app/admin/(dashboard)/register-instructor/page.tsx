"use client";
import React, { useState, useRef, useEffect } from "react";
import { 
  UserPlus, Camera, CheckCircle2, ShieldCheck, UserCircle, 
  Search, Eye, UserX, X, Plus
} from "lucide-react";
import Swal from "sweetalert2";

export default function InstructorManagement() {

  // ===== STATES =====
  const [fullName, setFullName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [instructors, setInstructors] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== FETCH =====
  const fetchInstructors = async () => {
    try {
      const res = await fetch("/api/admin/instructors");
      const json = await res.json();
      if (json.success) setInstructors(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchInstructors(); }, []);

  // ===== IMAGE =====
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ===== REGISTER =====
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Please upload an image");

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("speciality", speciality);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("password", password);
    formData.append("image", imageFile);

    try {
      const res = await fetch("/api/admin/instructors", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        setIsSuccess(true);
        setFullName("");
        setSpeciality("");
        setEmail("");
        setMobile("");
        setPassword("");
        setImageFile(null);
        setPreviewUrl(null);

        fetchInstructors();
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        alert(json.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== STATUS UPDATE =====
  const handleStatusUpdate = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const actionText = newStatus === 1 ? "Activate" : "Deactivate";

    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes`
    });

    if (confirm.isConfirmed) {
      await fetch("/api/admin/instructors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      fetchInstructors();
      setSelectedInstructor(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-24">

      {/* ================= REGISTER FORM (OLD) ================= */}
      <section>
        <h1 className="text-3xl font-bold mb-6">Register Instructor</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* IMAGE */}
          <div>
            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer text-center">
              <div className="w-40 h-40 mx-auto rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle size={80} />
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden />
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2">
            <form onSubmit={handleRegister} className="space-y-4">

              <input value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Full Name" required className="w-full p-3 border rounded" />

              <input value={speciality} onChange={(e)=>setSpeciality(e.target.value)} placeholder="Speciality" required className="w-full p-3 border rounded" />

              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full p-3 border rounded" />

              <input value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile" required className="w-full p-3 border rounded" />

              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full p-3 border rounded" />

              <button className="w-full bg-blue-600 text-white p-3 rounded">
                {isSubmitting ? "Loading..." : isSuccess ? "Success" : "Register"}
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* ================= LIST (NEW) ================= */}
      <section>
        <h2 className="text-2xl mb-4">Manage Instructors</h2>

        <input 
          value={searchTerm} 
          onChange={(e)=>setSearchTerm(e.target.value)} 
          placeholder="Search..." 
          className="border p-2 mb-6 w-full"
        />

        <div className="grid grid-cols-3 gap-4">
          {instructors
            .filter(i => i.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((ins) => (
              <div key={ins.id} className={`p-4 border rounded ${ins.status===0 && "opacity-50"}`}>
                <img src={ins.image_url} className="w-16 h-16 object-cover rounded mb-2" />
                <h3>{ins.full_name}</h3>
                <p>{ins.speciality}</p>

                <button onClick={()=>setSelectedInstructor(ins)} className="mt-2 text-blue-500">
                  View
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded w-[400px]">
            <h2>{selectedInstructor.full_name}</h2>

            <p>{selectedInstructor.email}</p>
            <p>{selectedInstructor.mobile}</p>

            {selectedInstructor.status === 1 ? (
              <button onClick={()=>handleStatusUpdate(selectedInstructor.id,1)} className="bg-red-500 text-white p-2 mt-4 w-full">
                Deactivate
              </button>
            ) : (
              <button onClick={()=>handleStatusUpdate(selectedInstructor.id,0)} className="bg-green-500 text-white p-2 mt-4 w-full">
                Activate
              </button>
            )}

            <button onClick={()=>setSelectedInstructor(null)} className="mt-2 w-full">
              Close
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
