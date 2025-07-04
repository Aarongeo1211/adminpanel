import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import TransformationForm from './TransformationForm';

function TransformationList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    const q = query(collection(db, 'transformations'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  const handleEdit = item => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = async item => {
    if (!window.confirm('Delete this transformation?')) return;
    await deleteDoc(doc(db, 'transformations', item.id));
    // Delete images from storage
    if (item.beforeImg) try { await deleteObject(ref(storage, item.beforeImg)); } catch {}
    if (item.afterImg) try { await deleteObject(ref(storage, item.afterImg)); } catch {}
    fetchList();
  };

  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditItem(null);
    fetchList();
  };

  return (
    <div>
      {showForm ? (
        <TransformationForm initialData={editItem || {}} onSave={handleFormSave} onCancel={()=>{setShowForm(false);setEditItem(null);}} />
      ) : (
        <div>
          <button onClick={handleAdd} style={{background:'#2ecc71',color:'#fff',padding:'10px 20px',border:'none',borderRadius:5,marginBottom:20}}>Add New Transformation</button>
          {loading ? <p>Loading...</p> : (
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#eee'}}>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Before</th>
                  <th>After</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(item => (
                  <tr key={item.id} style={{borderBottom:'1px solid #eee'}}>
                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>{item.beforeImg && <img src={item.beforeImg} alt="before" style={{width:60}} />}</td>
                    <td>{item.afterImg && <img src={item.afterImg} alt="after" style={{width:60}} />}</td>
                    <td>{item.order}</td>
                    <td>
                      <button onClick={()=>handleEdit(item)} style={{marginRight:8}}>Edit</button>
                      <button onClick={()=>handleDelete(item)} style={{color:'red'}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default TransformationList; 