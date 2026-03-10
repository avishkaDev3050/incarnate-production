"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Edit, Trash2, Eye, Plus, Package, Loader2, FileCheck } from "lucide-react";
import ProductModal from "../../../../components/ProductModal";

export default function ManageProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, mode: 'add' | 'edit' | 'view', data: any}>({
    isOpen: false, mode: 'add', data: null
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      
      if (json.success) {
        const formattedData = json.data.map((p: any) => {
          // Parse Images JSON
          let imgs = [];
          try { imgs = typeof p.images === "string" ? JSON.parse(p.images) : (p.images || []); } catch (e) { imgs = []; }
          
          // Parse PDF JSON (Since DB column is JSON)
          let pdfs = [];
          try { pdfs = typeof p.pdf_url === "string" ? JSON.parse(p.pdf_url) : (p.pdf_url || []); } catch (e) { pdfs = []; }
          
          return { 
            ...p, 
            images: Array.isArray(imgs) ? imgs : [],
            // Set the first PDF found as the lessonPdf for the modal
            lessonPdf: Array.isArray(pdfs) && pdfs.length > 0 ? pdfs[0] : null 
          };
        });
        setProducts(formattedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openModal = (mode: 'add' | 'edit' | 'view', data: any = null) => {
    setModalConfig({ isOpen: true, mode, data });
  };

  const handleDelete = async (id: number) => {
    if(confirm("Are you sure?")) {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) fetchProducts();
    }
  };

  const handleSave = (result: any) => {
    if (result.success) {
      fetchProducts();
      setModalConfig({ ...modalConfig, isOpen: false });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Products</h1>
          <p className="text-slate-500 text-sm mt-1">Manage inventory and lesson materials.</p>
        </div>
        <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:bg-slate-900 transition-all">
          <Plus size={18}/> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
            <tr>
              <th className="px-8 py-5">Product</th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5">Lesson PDF</th>
              <th className="px-8 py-5">Price</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" size={32} /></td></tr>
            ) : products.map((product) => (
              <tr key={product.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-8 py-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                    {product.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover" /> : <Package className="m-auto mt-3 text-slate-300" />}
                  </div>
                  <span className="font-bold text-slate-700">{product.name}</span>
                </td>
                <td className="px-8 py-5 text-sm text-slate-500">{product.category}</td>
                <td className="px-8 py-5">
                  {product.lessonPdf ? (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
                      <FileCheck size={14} /> Attached
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs uppercase italic font-medium">None</span>
                  )}
                </td>
                <td className="px-8 py-5 font-bold text-blue-600">${product.price}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal('view', product)} className="p-2 text-slate-400 hover:text-blue-600 rounded-xl"><Eye size={18}/></button>
                    <button onClick={() => openModal('edit', product)} className="p-2 text-slate-400 hover:text-amber-600 rounded-xl"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-xl"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal 
        isOpen={modalConfig.isOpen}
        mode={modalConfig.mode}
        productData={modalConfig.data}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onSave={handleSave}
      />
    </div>
  );
}