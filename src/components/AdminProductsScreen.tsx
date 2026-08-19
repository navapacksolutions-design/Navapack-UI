// import React, { useEffect, useState } from 'react';
// import { AdminProduct } from '../types';
// import { appsScriptApi } from '../services/appsScriptApi';

// interface Props { token: string; onLogout: () => void; }
// const emptyProduct: AdminProduct = { id: '', name: '', category: '', categorySlug: '', description: '', tag: '', imageUrl: '', active: true };

// export const AdminProductsScreen: React.FC<Props> = ({ token, onLogout }) => {
//   const [products, setProducts] = useState<AdminProduct[]>([]);
//   const [draft, setDraft] = useState<AdminProduct>(emptyProduct);
//   const [status, setStatus] = useState('Loading products…');

//   const load = async () => {
//     try { setProducts(await appsScriptApi.getProducts()); setStatus(''); }
//     catch (err) { setStatus(err instanceof Error ? err.message : 'Unable to load products.'); }
//   };
//   useEffect(() => { load(); }, []);
//   const save = async (event: React.FormEvent) => {
//     event.preventDefault(); setStatus('Saving…');
//     try { await appsScriptApi.saveProduct({ ...draft, id: draft.id || crypto.randomUUID() }, token); setDraft(emptyProduct); await load(); setStatus('Product saved.'); }
//     catch (err) { setStatus(err instanceof Error ? err.message : 'Unable to save product.'); }
//   };
//   const update = (key: keyof AdminProduct, value: string | boolean) => setDraft({ ...draft, [key]: value });

//   return <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-10">
//     <div className="flex justify-between gap-4 items-start mb-10"><div><span className="text-xs font-bold text-[#006c49] uppercase tracking-widest">Admin</span><h1 className="text-4xl font-extrabold">Product catalogue</h1></div><button onClick={onLogout} className="rounded-full border px-5 py-2 text-sm font-bold">Sign out</button></div>
//     {status && <p className="mb-5 text-sm text-[#45464d]">{status}</p>}
//     <div className="grid lg:grid-cols-[360px_1fr] gap-8">
//       <form onSubmit={save} className="rounded-2xl bg-white border p-6 space-y-3 h-fit">
//         <h2 className="font-bold text-xl">{draft.id ? 'Edit product' : 'Add product'}</h2>
//         {(['name', 'category', 'categorySlug', 'tag', 'imageUrl'] as const).map((key) => <input key={key} required={key === 'name'} value={draft[key] as string} onChange={(e) => update(key, e.target.value)} placeholder={key} className="w-full rounded-xl border p-2.5 text-sm" />)}
//         <textarea required value={draft.description} onChange={(e) => update('description', e.target.value)} placeholder="description" className="w-full rounded-xl border p-2.5 text-sm" rows={4} />
//         <label className="flex gap-2 text-sm"><input type="checkbox" checked={draft.active !== false} onChange={(e) => update('active', e.target.checked)} /> Visible on site</label>
//         <button className="w-full bg-[#006c49] text-white rounded-full py-3 text-sm font-bold">Save product</button>
//       </form>
//       <div className="grid sm:grid-cols-2 gap-4">{products.map((product) => <button key={product.id} onClick={() => setDraft(product)} className="text-left bg-white border rounded-2xl overflow-hidden hover:shadow-md"><img src={product.imageUrl} alt="" className="h-32 w-full object-cover bg-[#f2f4f6]" /><div className="p-4"><p className="font-bold">{product.name}</p><p className="text-xs text-[#45464d] mt-1">{product.category} · {product.active === false ? 'Hidden' : 'Visible'}</p></div></button>)}</div>
//     </div>
//   </div>;
// };
