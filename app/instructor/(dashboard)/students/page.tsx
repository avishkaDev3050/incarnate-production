"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    student_name: "",
    mobile: "",
    nic: "",
    class_name: "",
  });

  // Fetch Data
  const fetchData = async () => {
    try {
      const res = await fetch("/api/instructor/students");
      const result = await res.json();
      if (result.success) {
        setStudents(result.students);
        setModules(result.modules);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/instructor/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success!", "Student registered successfully.", "success");
        setShowModal(false);
        setFormData({ student_name: "", mobile: "", nic: "", class_name: "" });
        fetchData(); // List eka refresh karanawa
      } else {
        Swal.fire("Error!", data.error || "Something went wrong", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to connect to server", "error");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Students</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Register Student
        </button>
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">NIC</th>
              <th className="p-4">Class</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
            ) : students.length > 0 ? (
              students.map((s: any) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{s.student_name}</td>
                  <td className="p-4">{s.mobile}</td>
                  <td className="p-4">{s.nic || "N/A"}</td>
                  <td className="p-4">{s.class_name}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No students registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Register New Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Student Name"
                className="w-full border p-2 rounded"
                required
                onChange={(e) => setFormData({...formData, student_name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Mobile (10 Digits)"
                className="w-full border p-2 rounded"
                required
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
              <input
                type="text"
                placeholder="NIC (Optional)"
                className="w-full border p-2 rounded"
                onChange={(e) => setFormData({...formData, nic: e.target.value})}
              />
              <select 
                className="w-full border p-2 rounded"
                required
                onChange={(e) => setFormData({...formData, class_name: e.target.value})}
              >
                <option value="">Select Class</option>
                {modules.map((m: any, idx: number) => (
                  <option key={idx} value={m.module}>{m.module}</option>
                ))}
              </select>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded font-semibold">Save Student</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}