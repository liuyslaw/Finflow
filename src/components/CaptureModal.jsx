/* ═════════════════════════════════════════════════════════════════════════════
   CaptureModal.jsx — FlowSuite Capture as a drop-in FinFlow modal
   SynerGrowth Consulting · v1.0

   TWO USAGE MODES:

   ① GLOBAL (main page FAB):
        <CaptureFab onComplete={handleCapturedDoc}/>
      Floating camera button, bottom-right. Auto-detects doc type and routes.
      onComplete receives { module, payload } — your router then navigates to
      that module with the payload pre-filled.

   ② MODULE-LOCKED (inside Supplier Invoice / GR / Vendor Master / Fixed Assets):
        <CaptureButton module="supplier_invoice" onComplete={prefillForm}/>
      Inline button. Capture is locked to that module's schema; extraction
      prompt is specialised; payload maps 1:1 to the module's form fields.

   VITE NOTE (per FinFlow lessons): all imports are at the absolute top of this
   file. Wire the components into the AuthedApp render switch / module forms —
   no dynamic imports needed.

   COST MODEL: Tier 1 (Tesseract.js, free, in-browser) handles every page;
   Tier 2 (Claude Haiku via /api/claude proxy) fires only below the 90%
   confidence threshold or on math-validation failure. Expected escalation
   rate 5-15% => thousands of docs/day for a few dollars. See hybridOcr.js.
═════════════════════════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from "react";
import { preprocessForOcr, tesseractPass, parseFields, scoreTier1, claudeEscalation, OCR_CONFIG,
  QUALITY_TIERS, getQualityTier, setQualityTier, premiumExtraction, premiumValidation } from "./hybridOcr.js";

/* ── Config ─────────────────────────────────────────────────────────────── */
const STORAGE_KEY     = "finflow_capture_templates"; // lives alongside finflow_v5

const C = {
  gold:"#FAA819", magenta:"#B84480", deep:"#1E0830", purple:"#7B3F8C",
  green:"#22D3A0", surface:"#F8F7FC", card:"#FFFFFF",
  border:"#E5DFEF", txt:"#1E0830", sub:"#6B5F7A",
};
const grad = `linear-gradient(135deg,${C.gold},${C.magenta})`;

/* ── Module registry: schema + field labels per FinFlow module ──────────── */
export const CAPTURE_MODULES = {
  supplier_invoice: {
    icon:"🧾", name:"Supplier Invoice", color:"#B84480",
    docTypes:["invoice"],
    docHint:"a supplier invoice (vendor details, invoice number, line items, totals, PO reference)",
    fields:[
      ["vendorName","Vendor","vendor.name"],["invoiceNo","Invoice No.","docFields.docNumber"],
      ["invoiceDate","Invoice Date","docFields.date"],["dueDate","Due Date","docFields.dueDate"],
      ["poReference","PO Reference","docFields.poReference"],["currency","Currency","docFields.currency"],
      ["paymentTerms","Payment Terms","docFields.paymentTerms"],["total","Total","total"],
    ],
  },
  goods_receipt: {
    icon:"📦", name:"Goods Receipt", color:"#7B3F8C",
    docTypes:["delivery_order","packing_list"],
    docHint:"a delivery order or packing list (DO number, date, PO reference, supplier, item lines)",
    fields:[
      ["doNumber","DO Number","docFields.docNumber"],["receivedDate","Received Date","docFields.date"],
      ["poReference","PO Reference","docFields.poReference"],["supplier","Supplier","vendor.name"],
    ],
  },
  vendor_master: {
    icon:"🏢", name:"Vendor Master", color:"#38BDF8",
    docTypes:["business_registration","bank_letter","vendor_form"],
    docHint:"a vendor onboarding document (business registration, bank letter, or vendor form — company name, registration number, tax ID, address, bank account)",
    fields:[
      ["vendorName","Vendor Name","vendor.name"],["regNo","Registration No.","vendor.regNo"],
      ["taxId","Tax ID","vendor.taxId"],["address","Address","vendor.address"],
      ["bankAccount","Bank Account","vendor.bankAccount"],["contact","Contact","vendor.contact"],
    ],
  },
  fixed_assets: {
    icon:"🏗️", name:"Fixed Assets", color:"#22D3A0",
    docTypes:["receipt","asset_tag","purchase_record"],
    docHint:"a purchase receipt, asset tag, or purchase record (description, date, cost, supplier)",
    fields:[
      ["description","Asset Description","_firstLine"],["purchaseDate","Purchase Date","docFields.date"],
      ["cost","Cost","total"],["supplier","Supplier","vendor.name"],
      ["refDoc","Reference Doc","docFields.docNumber"],
    ],
  },
  archive: {
    icon:"🗄️", name:"Document Archive", color:"#6B5F7A",
    docTypes:["other","letter","contract","report","form"],
    docHint:"a general business document",
    fields:[["docType","Document Type","docType"],["date","Date","docFields.date"]],
  },
};
const routeModule = t => Object.entries(CAPTURE_MODULES)
  .find(([,m])=>m.docTypes.includes(t))?.[0] ?? "archive";

/* ── small utils ────────────────────────────────────────────────────────── */
const fileToB64=f=>new Promise((res,rej)=>{const r=new FileReader();
  r.onload=()=>res(r.result.split(",")[1]);r.onerror=()=>rej(new Error("read"));r.readAsDataURL(f);});
const loadImg=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=s;});
const safeParse=t=>{try{return JSON.parse(t);}catch{const m=t.match(/\{[\s\S]*\}/);
  if(m){try{return JSON.parse(m[0]);}catch{}}return null;}};
const getPath=(o,p)=>p.split(".").reduce((a,k)=>a?.[k],o);



/* ── template memory (localStorage — same persistence layer as finflow_v5) ─ */
const loadTemplates=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");}catch{return{};}};
const saveTemplate=(key,tpl)=>{try{
  const all=loadTemplates();
  all[key]={...tpl,lastUsed:Date.now(),uses:(all[key]?.uses||0)+1};
  localStorage.setItem(STORAGE_KEY,JSON.stringify(all));return all;
}catch{return null;}};
const vendorKeyOf=n=>String(n||"").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,40);

/* ── edge estimate (Sobel) + perspective warp ───────────────────────────── */
function estimateQuad(img){
  const S=160,scale=S/Math.max(img.naturalWidth,img.naturalHeight);
  const w=Math.round(img.naturalWidth*scale),h=Math.round(img.naturalHeight*scale);
  const cv=document.createElement("canvas");cv.width=w;cv.height=h;
  const ctx=cv.getContext("2d");ctx.drawImage(img,0,0,w,h);
  const d=ctx.getImageData(0,0,w,h).data;
  const g=new Float32Array(w*h);
  for(let i=0;i<w*h;i++)g[i]=0.299*d[i*4]+0.587*d[i*4+1]+0.114*d[i*4+2];
  const mag=new Float32Array(w*h);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
    const gx=-g[(y-1)*w+x-1]-2*g[y*w+x-1]-g[(y+1)*w+x-1]+g[(y-1)*w+x+1]+2*g[y*w+x+1]+g[(y+1)*w+x+1];
    const gy=-g[(y-1)*w+x-1]-2*g[(y-1)*w+x]-g[(y-1)*w+x+1]+g[(y+1)*w+x-1]+2*g[(y+1)*w+x]+g[(y+1)*w+x+1];
    mag[y*w+x]=Math.sqrt(gx*gx+gy*gy);
  }
  const rowE=new Float32Array(h),colE=new Float32Array(w);
  for(let y=0;y<h;y++){let s=0;for(let x=0;x<w;x++)s+=mag[y*w+x];rowE[y]=s;}
  for(let x=0;x<w;x++){let s=0;for(let y=0;y<h;y++)s+=mag[y*w+x];colE[x]=s;}
  const rT=Math.max(...rowE)*0.25,cT=Math.max(...colE)*0.25;
  let top=0,bot=h-1,left=0,right=w-1;
  for(let y=0;y<h*0.45;y++)if(rowE[y]>rT){top=y;break;}
  for(let y=h-1;y>h*0.55;y--)if(rowE[y]>rT){bot=y;break;}
  for(let x=0;x<w*0.45;x++)if(colE[x]>cT){left=x;break;}
  for(let x=w-1;x>w*0.55;x--)if(colE[x]>cT){right=x;break;}
  const pad=2;
  top=Math.max(0,top-pad);left=Math.max(0,left-pad);
  bot=Math.min(h-1,bot+pad);right=Math.min(w-1,right+pad);
  return {tl:{x:left/w,y:top/h},tr:{x:right/w,y:top/h},
          br:{x:right/w,y:bot/h},bl:{x:left/w,y:bot/h}};
}

function perspectiveWarp(img,quad,outW=1400){
  const W=img.naturalWidth,H=img.naturalHeight;
  const p=[[quad.tl.x*W,quad.tl.y*H],[quad.tr.x*W,quad.tr.y*H],
           [quad.br.x*W,quad.br.y*H],[quad.bl.x*W,quad.bl.y*H]];
  const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  const ratio=((dist(p[0],p[3])+dist(p[1],p[2]))/2)/(((dist(p[0],p[1])+dist(p[3],p[2]))/2)||1);
  const ow=outW,oh=Math.round(outW*ratio);
  const src=[[0,0],[ow,0],[ow,oh],[0,oh]];
  const A=[],B=[];
  for(let i=0;i<4;i++){
    const [x,y]=src[i],[u,v]=p[i];
    A.push([x,y,1,0,0,0,-u*x,-u*y]);B.push(u);
    A.push([0,0,0,x,y,1,-v*x,-v*y]);B.push(v);
  }
  const n=8;
  for(let c=0;c<n;c++){
    let piv=c;
    for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[piv][c]))piv=r;
    [A[c],A[piv]]=[A[piv],A[c]];[B[c],B[piv]]=[B[piv],B[c]];
    for(let r=c+1;r<n;r++){const f=A[r][c]/A[c][c];
      for(let k=c;k<n;k++)A[r][k]-=f*A[c][k];B[r]-=f*B[c];}
  }
  const hh=new Array(n);
  for(let r=n-1;r>=0;r--){let s=B[r];
    for(let k=r+1;k<n;k++)s-=A[r][k]*hh[k];hh[r]=s/A[r][r];}
  const [a,b,c2,d2,e,f2,g2,h2]=hh;
  const sc=document.createElement("canvas");sc.width=W;sc.height=H;
  const sctx=sc.getContext("2d");sctx.drawImage(img,0,0);
  const sd=sctx.getImageData(0,0,W,H).data;
  const oc=document.createElement("canvas");oc.width=ow;oc.height=oh;
  const octx=oc.getContext("2d");
  const od=octx.createImageData(ow,oh);
  for(let y=0;y<oh;y++)for(let x=0;x<ow;x++){
    const den=g2*x+h2*y+1;
    const sx=(a*x+b*y+c2)/den,sy=(d2*x+e*y+f2)/den;
    const xi=Math.round(sx),yi=Math.round(sy);
    const oi=(y*ow+x)*4;
    if(xi>=0&&xi<W&&yi>=0&&yi<H){
      const si=(yi*W+xi)*4;
      od.data[oi]=sd[si];od.data[oi+1]=sd[si+1];od.data[oi+2]=sd[si+2];od.data[oi+3]=255;
    }else{od.data[oi]=od.data[oi+1]=od.data[oi+2]=255;od.data[oi+3]=255;}
  }
  octx.putImageData(od,0,0);
  return oc.toDataURL("image/jpeg",0.92);
}

/* ── invoice math validation ────────────────────────────────────────────── */
const num=s=>{if(s==null)return NaN;
  return parseFloat(String(s).replace(/[^\d.\-,]/g,"").replace(/,(?=\d{3})/g,"").replace(",","."));};
function validateMath(inv){
  const checks=[];
  if(!inv?.lineItems?.length)return{checks,allPass:null};
  let sum=0;
  inv.lineItems.forEach((li,i)=>{
    const q=num(li.qty),up=num(li.unitPrice),amt=num(li.amount);
    if(!isNaN(q)&&!isNaN(up)&&!isNaN(amt)){
      const ok=Math.abs(q*up-amt)<0.02;
      checks.push({label:`Line ${i+1}`,detail:`${q}×${up.toFixed(2)}=${(q*up).toFixed(2)} vs ${amt.toFixed(2)}`,pass:ok});
    }
    if(!isNaN(amt))sum+=amt;
  });
  const sub=num(inv.subtotal),tax=num(inv.tax),tot=num(inv.total);
  if(!isNaN(sub)&&sum>0)checks.push({label:"Σ→Subtotal",detail:`${sum.toFixed(2)} vs ${sub.toFixed(2)}`,pass:Math.abs(sum-sub)<0.05});
  if(!isNaN(sub)&&!isNaN(tax)&&!isNaN(tot))
    checks.push({label:"Sub+Tax→Total",detail:`${(sub+tax).toFixed(2)} vs ${tot.toFixed(2)}`,pass:Math.abs(sub+tax-tot)<0.05});
  else if(!isNaN(tot)&&sum>0&&isNaN(sub))
    checks.push({label:"Σ→Total",detail:`${sum.toFixed(2)} vs ${tot.toFixed(2)}`,pass:Math.abs(sum-tot)<0.05});
  return{checks,allPass:checks.length?checks.every(c=>c.pass):null};
}

/* ── merge pages ────────────────────────────────────────────────────────── */
function mergePages(pages){
  if(pages.length===1)return pages[0];
  const m={...pages[0]};
  m.lineItems=pages.flatMap(p=>p.lineItems||[]);
  m.rawText=pages.map((p,i)=>`--- PAGE ${i+1} ---\n${p.rawText||""}`).join("\n\n");
  m.unclearCount=pages.reduce((s,p)=>s+(p.unclearCount||0),0);
  const last=pages[pages.length-1];
  m.subtotal=last.subtotal??m.subtotal;m.tax=last.tax??m.tax;m.total=last.total??m.total;
  return m;
}

/* ── payload mapper ─────────────────────────────────────────────────────── */
function buildPayload(moduleId,ext,edits,score,math){
  const reg=CAPTURE_MODULES[moduleId];
  const out={_module:moduleId,_capturedAt:new Date().toISOString(),
    _confidence:score,_mathValidation:math?.allPass,_source:"flowsuite-capture"};
  reg.fields.forEach(([key,,path])=>{
    out[key]=edits[path]??(path==="_firstLine"
      ?(ext.lineItems?.[0]?.description||ext.rawText?.slice(0,80))
      :getPath(ext,path));
  });
  if(moduleId==="supplier_invoice"){
    out.lineItems=ext.lineItems;out.subtotal=ext.subtotal;out.tax=ext.tax;
    out.threeWayMatchReady=!!ext.docFields?.poReference;
  }
  if(moduleId==="goods_receipt")out.items=ext.lineItems;
  return out;
}

/* ── tiny UI bits ───────────────────────────────────────────────────────── */
const Spin=({color=C.gold,size=16})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" style={{animation:"_cs .9s linear infinite",flexShrink:0}}>
    <style>{`@keyframes _cs{to{transform:rotate(360deg)}}`}</style>
    <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="3" strokeDasharray="36 18" strokeLinecap="round"/>
  </svg>);
const Pill=({score})=>{
  const cfg=score==null?{c:C.sub,bg:C.surface,l:"—"}
    :score>=90?{c:"#059669",bg:"#ECFDF5",l:`${score}%`}
    :score>=70?{c:"#D97706",bg:"#FFFBEB",l:`${score}%`}
    :{c:"#DC2626",bg:"#FEF2F2",l:`${score}%`};
  return <span style={{background:cfg.bg,color:cfg.c,borderRadius:999,padding:"2px 10px",
    fontSize:11,fontWeight:700}}>{cfg.l}</span>;
};

/* ── crop editor ────────────────────────────────────────────────────────── */
function CropEditor({page,onConfirm,onSkip,onCancel}){
  const [quad,setQuad]=useState(page.quad);
  const [dragKey,setDragKey]=useState(null);
  const boxRef=useRef();
  const down=k=>e=>{e.preventDefault();setDragKey(k);};
  const move=e=>{
    if(!dragKey||!boxRef.current)return;
    const r=boxRef.current.getBoundingClientRect();
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    setQuad(q=>({...q,[dragKey]:{
      x:Math.min(1,Math.max(0,(cx-r.left)/r.width)),
      y:Math.min(1,Math.max(0,(cy-r.top)/r.height))}}));
  };
  const pts=`${quad.tl.x*100},${quad.tl.y*100} ${quad.tr.x*100},${quad.tr.y*100} ${quad.br.x*100},${quad.br.y*100} ${quad.bl.x*100},${quad.bl.y*100}`;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:10001,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16,
      fontFamily:"'DM Sans',system-ui,sans-serif"}}
      onMouseMove={move} onMouseUp={()=>setDragKey(null)}
      onTouchMove={move} onTouchEnd={()=>setDragKey(null)}>
      <p style={{color:"#fff",fontSize:13,fontWeight:600,margin:"0 0 3px"}}>✂️ Adjust document edges</p>
      <p style={{color:"rgba(255,255,255,0.5)",fontSize:10.5,margin:"0 0 13px"}}>Drag gold corners — page is flattened automatically</p>
      <div ref={boxRef} style={{position:"relative",maxWidth:"min(92vw,540px)",maxHeight:"56vh",touchAction:"none"}}>
        <img src={page.dataUrl} style={{maxWidth:"100%",maxHeight:"56vh",display:"block",borderRadius:8,objectFit:"contain"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points={pts} fill="rgba(250,168,25,0.12)" stroke="#FAA819" strokeWidth="0.8" vectorEffect="non-scaling-stroke"/>
        </svg>
        {Object.entries(quad).map(([k,p])=>(
          <div key={k} onMouseDown={down(k)} onTouchStart={down(k)}
            style={{position:"absolute",left:`${p.x*100}%`,top:`${p.y*100}%`,
              width:30,height:30,marginLeft:-15,marginTop:-15,borderRadius:999,
              background:dragKey===k?"#FAA819":"rgba(250,168,25,0.35)",
              border:"2.5px solid #FAA819",cursor:"grab",touchAction:"none",
              boxShadow:"0 0 0 6px rgba(250,168,25,0.12)"}}/>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={onCancel} style={{padding:"8px 16px",borderRadius:9,border:"1px solid rgba(255,255,255,0.2)",
          background:"transparent",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✕ Discard</button>
        <button onClick={onSkip} style={{padding:"8px 16px",borderRadius:9,border:"1px solid rgba(255,255,255,0.3)",
          background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Skip crop</button>
        <button onClick={()=>onConfirm(quad)} style={{padding:"8px 22px",borderRadius:9,border:"none",
          background:grad,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓ Crop & Flatten</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CaptureModal — the core component (both modes)
═══════════════════════════════════════════════════════════════════════════ */
export function CaptureModal({ lockedModule=null, onComplete, onClose }){
  const [pages,setPages]=useState([]);
  const [cropTarget,setCropTarget]=useState(null);
  const [busy,setBusy]=useState(false);
  const [stage,setStage]=useState("");
  const [ext,setExt]=useState(null);
  const [val,setVal]=useState(null);
  const [score,setScore]=useState(null);
  const [math,setMath]=useState(null);
  const [moduleId,setModuleId]=useState(lockedModule);
  const [edits,setEdits]=useState({});
  const [error,setError]=useState(null);
  const [tplUsed,setTplUsed]=useState(null);
  const [qTier,setQTier]=useState(getQualityTier());
  const changeTier=t=>{setQTier(t);setQualityTier(t);};
  const nativeRef=useRef();const fileRef=useRef();

  const lockedReg=lockedModule?CAPTURE_MODULES[lockedModule]:null;

  const addPage=async f=>{
    setError(null);
    const b64=await fileToB64(f);
    const dataUrl=`data:${f.type||"image/jpeg"};base64,${b64}`;
    const img=await loadImg(dataUrl);
    setCropTarget({id:Date.now()+Math.random(),dataUrl,img,quad:estimateQuad(img)});
  };
  const confirmCrop=quad=>{
    const t=cropTarget;setCropTarget(null);
    try{const warped=perspectiveWarp(t.img,quad,1400);
      setPages(p=>[...p,{id:t.id,dataUrl:warped}]);}
    catch{setPages(p=>[...p,{id:t.id,dataUrl:t.dataUrl}]);}
  };
  const skipCrop=()=>{const t=cropTarget;setCropTarget(null);
    setPages(p=>[...p,{id:t.id,dataUrl:t.dataUrl}]);};

  const run=async()=>{
    if(!pages.length)return;
    setBusy(true);setError(null);setExt(null);setVal(null);setScore(null);setMath(null);
    try{
      const results=[];let tplHint=null;let anyEscalated=false;let premiumScores=[];
      const templates=loadTemplates();
      for(let i=0;i<pages.length;i++){
        setStage(`Page ${i+1}/${pages.length}: preparing scan…`);
        const prep=await preprocessForOcr(pages[i].dataUrl);
        let fields;

        if(qTier==="premium"){
          /* ── PREMIUM: dual-pass Opus on every page ── */
          setStage(`Page ${i+1}/${pages.length}: Opus extraction…`);
          fields=await premiumExtraction(prep.greyB64,lockedReg?.docHint,tplHint);
          if(!fields)throw new Error(`Page ${i+1}: premium extraction unparseable`);
          fields._tier="opus";anyEscalated=true;
          setStage(`Page ${i+1}/${pages.length}: Opus validation…`);
          try{
            const v=await premiumValidation(prep.greyB64,fields);
            if(v){premiumScores.push(Math.round(v.overallConfidence??0));
              fields._issues=v.issues;fields._validatorNotes=v.validatorNotes;}
          }catch{premiumScores.push(80);}
        } else {
          /* ── STANDARD / PROFESSIONAL: free pass first ── */
          setStage(`Page ${i+1}/${pages.length}: free OCR pass…`);
          const t1=await tesseractPass(prep.binUrl,
            p=>setStage(`Page ${i+1}/${pages.length}: free OCR ${Math.round(p*100)}%`));
          fields=parseFields(t1.text);
          const m1=validateMath(fields);
          const s1=scoreTier1(t1.meanConf,fields,m1.allPass);
          fields._tier="tesseract";fields._tier1Score=s1;

          const mustEscalate = qTier==="professional"            /* Pro: verify ALL */
            || s1<OCR_CONFIG.ESCALATION_THRESHOLD
            || m1.allPass===false;
          if(mustEscalate){
            setStage(`Page ${i+1}/${pages.length}: ${qTier==="professional"?"AI verification":"AI escalation"}…`);
            try{
              const esc=await claudeEscalation(prep.greyB64,fields,lockedReg?.docHint);
              if(esc){fields={...fields,...esc,_tier:"claude",_tier1Score:s1};anyEscalated=true;}
            }catch(e){fields._escalationError=e.message;}
          }
        }
        results.push(fields);
        if(i===0&&fields.vendor?.name){
          const t=templates[vendorKeyOf(fields.vendor.name)];
          if(t){tplHint=t.layoutNotes;setTplUsed({vendor:fields.vendor.name,uses:t.uses});}
        }
      }
      const merged=mergePages(results);
      merged._anyEscalated=anyEscalated;merged._qualityTier=qTier;
      setExt(merged);
      if(!lockedModule)setModuleId(routeModule(merged.docType));

      /* ── Final scoring + math gate ── */
      const m=validateMath(merged);setMath(m);
      let s;
      if(qTier==="premium"){
        s=premiumScores.length?Math.round(premiumScores.reduce((a,b)=>a+b,0)/premiumScores.length):85;
      } else if(merged._tier==="claude"||results.some(r=>r._tier==="claude")){
        s=Math.max(85,Math.round(results.reduce((a,r)=>a+(r._tier1Score??0),0)/results.length));
      } else {
        s=Math.round(results.reduce((a,r)=>a+(r._tier1Score??0),0)/results.length);
      }
      if(results.some(r=>r._escalationError))s=Math.min(s,69);
      if(m.allPass===false)s=Math.min(s,69);
      if(m.allPass===true&&s>=85)s=Math.max(s,90);
      const tierNote=qTier==="premium"
        ?"Premium: dual-pass Opus extraction + independent validation."
        :qTier==="professional"
        ?"Professional: free OCR + AI verification on every document."
        :anyEscalated
        ?"Free OCR was uncertain — AI escalation applied (Haiku)."
        :"Resolved entirely by the free OCR tier — zero AI cost.";
      setVal({validatorNotes:tierNote,
        fieldScores:null,issues:results.flatMap(r=>r._issues||[])});
      setScore(s);
      if(merged.vendor?.name&&merged.layoutNotes)
        saveTemplate(vendorKeyOf(merged.vendor.name),
          {vendorName:merged.vendor.name,layoutNotes:merged.layoutNotes});
    }catch(e){setError(e.message);}
    setBusy(false);setStage("");
  };

  const push=()=>{
    const payload=buildPayload(moduleId,ext,edits,score,math);
    onComplete?.({module:moduleId,payload});
    onClose?.();
  };

  const gate=score===null?"pending":score>=90?"accepted":score>=70?"review":"rejected";
  const reg=moduleId?CAPTURE_MODULES[moduleId]:null;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(30,8,48,0.55)",zIndex:10000,
      display:"flex",alignItems:"center",justifyContent:"center",padding:14,
      fontFamily:"'DM Sans','Plus Jakarta Sans',system-ui,sans-serif"}}>
      <input ref={nativeRef} type="file" accept="image/*" capture="environment" style={{display:"none"}}
        onChange={e=>{const f=e.target.files?.[0];if(f)addPage(f);e.target.value="";}}/>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}}
        onChange={e=>{[...(e.target.files||[])].forEach(addPage);e.target.value="";}}/>
      {cropTarget&&<CropEditor page={cropTarget} onConfirm={confirmCrop}
        onSkip={skipCrop} onCancel={()=>setCropTarget(null)}/>}

      <div style={{background:C.card,borderRadius:16,width:"min(96vw,760px)",maxHeight:"92vh",
        overflowY:"auto",boxShadow:"0 24px 60px rgba(30,8,48,0.35)"}}>

        {/* Modal header */}
        <div style={{background:C.deep,borderRadius:"16px 16px 0 0",padding:"13px 18px",
          display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:2}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>📸</span>
            <div>
              <div style={{color:"#fff",fontSize:13,fontWeight:700}}>
                FlowSuite Capture{lockedReg?` — ${lockedReg.icon} ${lockedReg.name}`:""}
              </div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:8.5,letterSpacing:1.2}}>
                {lockedReg?"MODULE-LOCKED CAPTURE":"AUTO-ROUTING CAPTURE"}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.12)",border:"none",
            borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer",fontSize:12}}>✕</button>
        </div>

        <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>

          {/* Capture row */}
          {!ext&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button onClick={()=>nativeRef.current?.click()} style={{padding:"13px 8px",borderRadius:10,
                  border:`1.5px solid ${C.gold}`,background:"#FFF8E7",cursor:"pointer",fontFamily:"inherit",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:24}}>📸</span>
                  <span style={{fontSize:11,fontWeight:700,color:"#92600A"}}>Snap Photo</span>
                </button>
                <button onClick={()=>fileRef.current?.click()} style={{padding:"13px 8px",borderRadius:10,
                  border:`1.5px solid ${C.border}`,background:C.surface,cursor:"pointer",fontFamily:"inherit",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:24}}>📁</span>
                  <span style={{fontSize:11,fontWeight:700,color:C.sub}}>Upload Files</span>
                </button>
              </div>
              {lockedReg&&<p style={{margin:0,fontSize:10,color:C.sub,textAlign:"center"}}>
                Expecting: {lockedReg.docHint}</p>}

              {/* ── Quality tier selector (deployment/upsell setting) ── */}
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px"}}>
                <p style={{margin:"0 0 7px",fontSize:9,fontWeight:700,color:C.sub,
                  letterSpacing:1.2,textTransform:"uppercase"}}>Extraction Quality Tier</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                  {Object.entries(QUALITY_TIERS).map(([id,t])=>(
                    <button key={id} onClick={()=>changeTier(id)} style={{
                      padding:"8px 6px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",
                      border:`1.5px solid ${qTier===id?C.magenta:C.border}`,
                      background:qTier===id?"#FBF2F7":"#fff",
                      display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <span style={{fontSize:14}}>{t.icon}</span>
                      <span style={{fontSize:10,fontWeight:700,
                        color:qTier===id?C.magenta:C.sub}}>{t.name}</span>
                    </button>
                  ))}
                </div>
                <p style={{margin:"7px 0 0",fontSize:9.5,color:C.sub,lineHeight:1.5}}>
                  {QUALITY_TIERS[qTier].blurb}
                  <span style={{display:"block",marginTop:2,fontWeight:600,
                    color:qTier==="premium"?C.magenta:C.sub}}>{QUALITY_TIERS[qTier].cost}</span>
                </p>
              </div>

              {/* Page strip */}
              {pages.length>0&&(
                <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                  {pages.map((p,i)=>(
                    <div key={p.id} style={{position:"relative"}}>
                      <img src={p.dataUrl} style={{width:52,height:66,objectFit:"cover",
                        borderRadius:6,border:`1.5px solid ${C.border}`}}/>
                      <span style={{position:"absolute",bottom:2,left:2,background:C.deep,color:"#fff",
                        fontSize:8,borderRadius:4,padding:"1px 5px"}}>{i+1}</span>
                      <button onClick={()=>setPages(ps=>ps.filter(x=>x.id!==p.id))}
                        style={{position:"absolute",top:-6,right:-6,width:18,height:18,borderRadius:999,
                          background:"#DC2626",color:"#fff",border:"none",fontSize:9,cursor:"pointer",
                          display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                    </div>
                  ))}
                  <button onClick={()=>nativeRef.current?.click()} style={{width:52,height:66,
                    borderRadius:6,border:`1.5px dashed ${C.gold}`,background:"#FFF8E7",
                    cursor:"pointer",fontSize:18,color:"#92600A"}}>+</button>
                </div>
              )}

              <button onClick={run} disabled={!pages.length||busy} style={{
                background:!pages.length||busy?C.border:grad,border:"none",borderRadius:10,
                padding:"12px",color:!pages.length||busy?C.sub:"#fff",fontFamily:"inherit",
                fontSize:12.5,fontWeight:700,cursor:!pages.length||busy?"not-allowed":"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {busy?<><Spin/>{stage}</>:`⚡ Process ${pages.length} page${pages.length!==1?"s":""}`}
              </button>
            </>
          )}

          {error&&<div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:9,
            padding:"9px 13px",fontSize:11.5,color:"#991B1B"}}>{error}</div>}

          {/* Result */}
          {ext&&(
            <>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <Pill score={score}/>
                <span style={{fontSize:11.5,fontWeight:600,
                  color:gate==="accepted"?"#065F46":gate==="review"?"#92400E":"#991B1B"}}>
                  {gate==="accepted"?"≥90% — ready to push":gate==="review"?"70–89% — verify fields":"Below threshold — correct fields"}
                </span>
                {tplUsed&&<span style={{fontSize:9.5,color:"#065F46",background:"#ECFDF5",
                  padding:"2px 8px",borderRadius:99}}>🧠 Template: {tplUsed.vendor}</span>}
                {math?.allPass===true&&<span style={{fontSize:9.5,color:"#065F46",background:"#ECFDF5",
                  padding:"2px 8px",borderRadius:99}}>🧮 Math ✓</span>}
                {math?.allPass===false&&<span style={{fontSize:9.5,color:"#991B1B",background:"#FEF2F2",
                  padding:"2px 8px",borderRadius:99}}>🧮 Math ✕</span>}
                {ext._qualityTier&&<span style={{fontSize:9.5,color:C.magenta,background:"#FBF2F7",
                  padding:"2px 8px",borderRadius:99}}>{QUALITY_TIERS[ext._qualityTier]?.icon} {QUALITY_TIERS[ext._qualityTier]?.name}</span>}
              </div>

              {/* Module route (selectable only in global mode) */}
              <div style={{display:"flex",alignItems:"center",gap:9,background:C.surface,
                borderRadius:9,padding:"8px 12px",border:`1px solid ${reg?.color||C.border}`}}>
                <span style={{fontSize:18}}>{reg?.icon}</span>
                <span style={{fontSize:11.5,fontWeight:700,flex:1}}>
                  {lockedModule?reg?.name:`Routed to: ${reg?.name}`}
                </span>
                {!lockedModule&&(
                  <select value={moduleId} onChange={e=>setModuleId(e.target.value)}
                    style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 8px",
                      fontSize:10.5,fontFamily:"inherit",background:"#fff",cursor:"pointer"}}>
                    {Object.entries(CAPTURE_MODULES).map(([id,m])=>
                      <option key={id} value={id}>{m.icon} {m.name}</option>)}
                  </select>
                )}
              </div>

              {/* Editable fields for the target module */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:8}}>
                {reg?.fields.map(([key,label,path])=>{
                  const v=path==="_firstLine"
                    ?(ext.lineItems?.[0]?.description||"")
                    :getPath(ext,path);
                  const unclear=v==="[UNCLEAR]";
                  return(
                    <div key={key}>
                      <label style={{fontSize:9,color:unclear?"#DC2626":C.sub,fontWeight:600,
                        display:"block",marginBottom:2}}>{label}{unclear?" ⚠":""}</label>
                      <input value={edits[path]??(v||"")}
                        onChange={e=>setEdits(d=>({...d,[path]:e.target.value}))}
                        style={{width:"100%",boxSizing:"border-box",
                          border:`1px solid ${unclear&&edits[path]===undefined?"#FCA5A5":C.border}`,
                          borderRadius:6,padding:"6px 9px",fontSize:11.5,fontFamily:"inherit",
                          background:unclear&&edits[path]===undefined?"#FEF2F2":C.surface}}/>
                    </div>
                  );
                })}
              </div>

              {/* Line items summary */}
              {ext.lineItems?.length>0&&(
                <div style={{fontSize:10.5,color:C.sub,background:C.surface,borderRadius:8,
                  padding:"7px 11px"}}>
                  📋 {ext.lineItems.length} line item{ext.lineItems.length>1?"s":""} captured
                  {ext.total?` · Total ${ext.total}`:""}
                  {math?.checks?.length?` · ${math.checks.filter(c=>c.pass).length}/${math.checks.length} math checks pass`:""}
                </div>
              )}

              {/* Actions */}
              <div style={{display:"flex",gap:9,justifyContent:"flex-end",flexWrap:"wrap"}}>
                <button onClick={()=>{setExt(null);setVal(null);setScore(null);setMath(null);
                  setEdits({});setPages([]);}}
                  style={{padding:"9px 16px",borderRadius:9,border:`1px solid ${C.border}`,
                    background:"#fff",color:C.sub,fontSize:11.5,cursor:"pointer",fontFamily:"inherit"}}>
                  ↻ New capture
                </button>
                <button onClick={push} disabled={gate==="rejected"} style={{
                  padding:"9px 22px",borderRadius:9,border:"none",
                  background:gate==="rejected"?C.border:grad,
                  color:gate==="rejected"?C.sub:"#fff",fontSize:12,fontWeight:700,
                  cursor:gate==="rejected"?"not-allowed":"pointer",fontFamily:"inherit"}}>
                  {gate==="review"?"Push (flagged) →":"Push to form →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ① CaptureFab — global floating camera button for the FinFlow main page
═══════════════════════════════════════════════════════════════════════════ */
export function CaptureFab({ onComplete }){
  const [open,setOpen]=useState(false);
  return(
    <>
      <button onClick={()=>setOpen(true)} title="Capture document"
        style={{position:"fixed",bottom:24,right:24,zIndex:9000,
          width:60,height:60,borderRadius:999,border:"none",cursor:"pointer",
          background:grad,boxShadow:`0 8px 28px ${C.gold}55, 0 2px 8px rgba(30,8,48,0.3)`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,
          transition:"transform .15s"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        📷
      </button>
      {open&&<CaptureModal onComplete={onComplete} onClose={()=>setOpen(false)}/>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ② CaptureButton — module-locked inline button for P2P module headers
═══════════════════════════════════════════════════════════════════════════ */
export function CaptureButton({ module, onComplete, label }){
  const [open,setOpen]=useState(false);
  const reg=CAPTURE_MODULES[module];
  if(!reg)return null;
  return(
    <>
      <button onClick={()=>setOpen(true)} style={{
        background:"#FFF8E7",border:`1.5px solid ${C.gold}`,borderRadius:9,
        padding:"7px 14px",cursor:"pointer",fontFamily:"'DM Sans',system-ui,sans-serif",
        fontSize:11.5,fontWeight:700,color:"#92600A",
        display:"inline-flex",alignItems:"center",gap:6}}>
        📸 {label||`Capture ${reg.name}`}
      </button>
      {open&&<CaptureModal lockedModule={module} onComplete={onComplete} onClose={()=>setOpen(false)}/>}
    </>
  );
}

export default CaptureModal;
