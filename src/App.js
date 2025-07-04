import React, { useState } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import './App.css';
import TransformationList from './components/TransformationList';
import CaseStudyList from './components/CaseStudyList';

function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [tab, setTab] = useState('transformations');

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      alert('Login failed');
    }
  };

  const handleLogout = () => signOut(auth);

  if (!user) {
    return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
        <h2>Admin Login</h2>
        <button onClick={handleLogin} style={{padding:'10px 20px',fontSize:'1.1em'}}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div style={{maxWidth:900,margin:'40px auto',padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>Fitness Website Admin Panel</h1>
        <div>
          <span style={{marginRight:10}}>{user.displayName}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div style={{margin:'30px 0'}}>
        <button onClick={()=>setTab('transformations')} style={{marginRight:10,background:tab==='transformations'?'#2ecc71':'#eee',color:tab==='transformations'?'#fff':'#333',padding:'10px 20px',border:'none',borderRadius:5}}>Transformations</button>
        <button onClick={()=>setTab('caseStudies')} style={{background:tab==='caseStudies'?'#2ecc71':'#eee',color:tab==='caseStudies'?'#fff':'#333',padding:'10px 20px',border:'none',borderRadius:5}}>Case Studies</button>
      </div>
      <div>
        {tab === 'transformations' ? (
          <TransformationList />
        ) : (
          <CaseStudyList />
        )}
      </div>
    </div>
  );
}

export default App;
