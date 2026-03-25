import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts, createProduct, updateProduct, deleteProduct,
} from "../../features/Admin/adminSlice";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const EMPTY = { title: "", description: "", price: "", category: "", image: "", stock: 100 };
const CATEGORIES = ["electronics", "jewelery", "men's clothing", "women's clothing", "other"];

function ProductModal({ initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial || EMPTY);
  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category || !form.image) {
      toast.error("Please fill all required fields"); return;
    }
    onSave({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg">{initial ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { name: "title",       label: "Title *",       type: "text",   placeholder: "Product name" },
            { name: "image",       label: "Image URL *",   type: "text",   placeholder: "https://..." },
            { name: "price",       label: "Price (₹) *",   type: "number", placeholder: "0.00" },
            { name: "stock",       label: "Stock",         type: "number", placeholder: "100" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={change}
                placeholder={f.placeholder}
                step={f.name === "price" ? "0.01" : undefined}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={change}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows={3}
              placeholder="Product description..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
            >
              {loading ? "Saving..." : initial ? "Save Changes" : "Add Product"}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminProducts() {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((s) => s.admin);
  const [modal, setModal] = useState(null); // null | "add" | product object

  useEffect(() => { dispatch(fetchAdminProducts()); }, [dispatch]);

  const handleSave = async (data) => {
    if (modal === "add") {
      await dispatch(createProduct(data));
      toast.success("Product added");
    } else {
      await dispatch(updateProduct({ id: modal._id, data }));
      toast.success("Product updated");
    }
    setModal(null);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await dispatch(deleteProduct(id));
    toast.success("Product deleted");
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Products <span className="text-base font-normal text-gray-400 ml-1">({products.length})</span>
        </h1>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <FaPlus size={12} /> Add Product
        </button>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  {["Image", "Title", "Category", "Price", "Stock", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={p.image} alt={p.title} className="w-full h-full object-contain p-1" />
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="font-medium text-gray-800 line-clamp-2 leading-snug">{p.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full capitalize">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">₹{p.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${p.stock > 10 ? "text-green-600" : "text-red-500"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal(p)}
                          className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                          <FaEdit size={13} />
                        </button>
                        <button onClick={() => handleDelete(p._id, p.title)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <p className="text-gray-400 mb-3">No products in your database yet.</p>
                <button onClick={() => setModal("add")}
                  className="text-indigo-600 font-medium text-sm hover:text-indigo-800">
                  + Add your first product
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {modal && (
        <ProductModal
          initial={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          loading={isLoading}
        />
      )}
    </div>
  );
}

export default AdminProducts;
