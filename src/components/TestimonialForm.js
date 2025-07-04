import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const CLOUDINARY_CLOUD = 'dxoiq548o';
const CLOUDINARY_PRESET = 'upload_img';

function TestimonialForm({ initialData = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    img: initialData.img || '',
    description: initialData.description || '',
    order: initialData.order || 0,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleCloudinaryUpload = async (file) => {
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
      method: 'POST',
      body: data
    });
    const json = await res.json();
    setForm(f => ({...f, img: json.secure_url}));
    setUploading(false);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) handleCloudinaryUpload(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        order: Number(form.order),
      };
      if (initialData.id) {
        await updateDoc(doc(db, 'testimonials', initialData.id), data);
      } else {
        await addDoc(collection(db, 'testimonials'), data);
      }
      setLoading(false);
      onSave && onSave();
    } catch (err) {
      alert('Error saving testimonial');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom:30,background:'#f9f9f9',padding:20,borderRadius:8}}>
      <h3>{initialData.id ? 'Edit' : 'Add'} Testimonial</h3>
      <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:200}}>
          <label>Image URL<br/>
            <input name="img" value={form.img} onChange={handleChange} placeholder="Paste image URL or upload below" />
            {form.img && <img src={form.img} alt="testimonial" style={{width:80,marginTop:5}} />}
            <input type="file" accept="image/*" onChange={handleFile} />
            {uploading && <span>Uploading...</span>}
          </label>
        </div>
        <div style={{flex:2,minWidth:200}}>
          <label>Description<br/>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{width:'100%'}} required />
          </label>
        </div>
        <div style={{flex:1,minWidth:100}}>
          <label>Order<br/><input name="order" value={form.order} onChange={handleChange} type="number" /></label>
        </div>
      </div>
      <div style={{marginTop:20}}>
        <button type="submit" disabled={loading} style={{background:'#2ecc71',color:'#fff',padding:'10px 20px',border:'none',borderRadius:5}}>{loading ? 'Saving...' : 'Save'}</button>
        {onCancel && <button type="button" onClick={onCancel} style={{marginLeft:10}}>Cancel</button>}
      </div>
    </form>
  );
}

export default TestimonialForm; 