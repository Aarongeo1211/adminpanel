import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const CLOUDINARY_CLOUD = 'dxoiq548o';
const CLOUDINARY_PRESET = 'upload_img';

function TransformationForm({ initialData = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    age: initialData.age || '',
    beforeWeight: initialData.beforeWeight || '',
    afterWeight: initialData.afterWeight || '',
    beforeImg: initialData.beforeImg || '',
    afterImg: initialData.afterImg || '',
    frameworkText: initialData.frameworkText || '',
    resultText: initialData.resultText || '',
    order: initialData.order || 0,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({before: false, after: false});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleCloudinaryUpload = async (file, type) => {
    setUploading(u => ({...u, [type]: true}));
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
      method: 'POST',
      body: data
    });
    const json = await res.json();
    setForm(f => ({...f, [type + 'Img']: json.secure_url}));
    setUploading(u => ({...u, [type]: false}));
  };

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (file) handleCloudinaryUpload(file, type);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        age: Number(form.age),
        order: Number(form.order),
      };
      if (initialData.id) {
        await updateDoc(doc(db, 'transformations', initialData.id), data);
      } else {
        await addDoc(collection(db, 'transformations'), data);
      }
      setLoading(false);
      onSave && onSave();
    } catch (err) {
      alert('Error saving transformation');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom:30,background:'#f9f9f9',padding:20,borderRadius:8}}>
      <h3>{initialData.id ? 'Edit' : 'Add'} Transformation</h3>
      <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:200}}>
          <label>Name<br/><input name="name" value={form.name} onChange={handleChange} required /></label>
        </div>
        <div style={{flex:1,minWidth:100}}>
          <label>Age<br/><input name="age" value={form.age} onChange={handleChange} type="number" required /></label>
        </div>
        <div style={{flex:1,minWidth:120}}>
          <label>Before Weight<br/><input name="beforeWeight" value={form.beforeWeight} onChange={handleChange} required /></label>
        </div>
        <div style={{flex:1,minWidth:120}}>
          <label>After Weight<br/><input name="afterWeight" value={form.afterWeight} onChange={handleChange} required /></label>
        </div>
      </div>
      <div style={{display:'flex',gap:20,marginTop:15}}>
        <div style={{flex:1}}>
          <label>Before Image URL<br/>
            <input name="beforeImg" value={form.beforeImg} onChange={handleChange} placeholder="Paste image URL or upload below" />
            {form.beforeImg && <img src={form.beforeImg} alt="before" style={{width:80,marginTop:5}} />}
            <input type="file" accept="image/*" onChange={e=>handleFile(e,'before')} />
            {uploading.before && <span>Uploading...</span>}
          </label>
        </div>
        <div style={{flex:1}}>
          <label>After Image URL<br/>
            <input name="afterImg" value={form.afterImg} onChange={handleChange} placeholder="Paste image URL or upload below" />
            {form.afterImg && <img src={form.afterImg} alt="after" style={{width:80,marginTop:5}} />}
            <input type="file" accept="image/*" onChange={e=>handleFile(e,'after')} />
            {uploading.after && <span>Uploading...</span>}
          </label>
        </div>
      </div>
      <div style={{marginTop:15}}>
        <label>Framework Text<br/><input name="frameworkText" value={form.frameworkText} onChange={handleChange} /></label>
      </div>
      <div style={{marginTop:15}}>
        <label>Result Text<br/><input name="resultText" value={form.resultText} onChange={handleChange} /></label>
      </div>
      <div style={{marginTop:15}}>
        <label>Order<br/><input name="order" value={form.order} onChange={handleChange} type="number" /></label>
      </div>
      <div style={{marginTop:20}}>
        <button type="submit" disabled={loading} style={{background:'#2ecc71',color:'#fff',padding:'10px 20px',border:'none',borderRadius:5}}>{loading ? 'Saving...' : 'Save'}</button>
        {onCancel && <button type="button" onClick={onCancel} style={{marginLeft:10}}>Cancel</button>}
      </div>
    </form>
  );
}

export default TransformationForm; 