"use client";
import { useState, useRef, useEffect } from "react";

async function callAPI(messages: any[], system: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages, system })
  });
  const d = await res.json();
  return d.text || "";
}

export default function App() {
  const [msgs, setMsgs] = useState([{role:"ai",text:"こんにちは！AIパーソナルトレーナーです。何でも聞いてください。"}]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const ce = useRef<HTMLDivElement>(null);
  useEffect(()=>{ce.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const SYS = "あなたはプロのパーソナルトレーナーです。日本語で300文字以内で回答してください。";
  const send = async(text: string) => {
    if(!text.trim()||loading) return;
    const next=[...msgs,{role:"user",text}];
    setMsgs(next);setLoading(true);
    try{const h=next.map(m=>({role:m.role==="ai"?"assistant":"user",content:m.text}));const r=await callAPI(h,SYS);setMsgs(p=>[...p,{role:"ai",text:r}]);}
    catch(e){setMsgs(p=>[...p,{role:"ai",text:"エラー: "+e.message}]);}
    setLoading(false);
  };
  return (
    <div style={{background:"#080808",minHeight:"100vh",color:"#f0f0f0",fontFamily:"sans-serif",display:"flex",flexDirection:"column",maxWidth:440,margin:"0 auto",padding:16}}>
      <div style={{fontSize:20,fontWeight:700,marginBottom:16,color:"#e8ff47"}}>AI Personal Trainer</div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{maxWidth:"85%",padding:"10px 13px",borderRadius:12,alignSelf:m.role==="user"?"flex-end":"flex-start",background:m.role==="user"?"rgba(232,255,71,.15)":"#181818",color:m.role==="user"?"#e8ff47":"#f0f0f0",whiteSpace:"pre-wrap"}}>{m.text}</div>
        ))}
        {loading&&<div style={{color:"#555",fontStyle:"italic"}}>考え中…</div>}
        <div ref={ce}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!loading){send(inp);setInp("");}}} placeholder="質問を入力…" style={{flex:1,background:"#181818",border:".5px solid rgba(255,255,255,.1)",borderRadius:10,color:"#f0f0f0",fontSize:14,padding:"10px 12px",outline:"none"}}/>
        <button onClick={()=>{send(inp);setInp("");}} disabled={loading} style={{width:40,height:40,borderRadius:10,background:loading?"#333":"#e8ff47",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth={2} strokeLinecap="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
    </div>
  );
}