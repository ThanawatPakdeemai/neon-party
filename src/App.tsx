import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, ChevronRight, History, Minus, Music2, Plus, RotateCcw, Settings2, Shuffle, Sparkles, Volume2, VolumeX, X } from 'lucide-react'
import { categories, challenges, type Category, type Challenge, type Level } from './data'
import { useGame } from './store'

type Page = 'home' | 'players' | 'game' | 'settings' | 'history'
const wheelColors = ['#9333ea','#ec4899','#7c3aed','#db2777','#a855f7','#be185d','#6d28d9','#f472b6']
const sectors = 8
const segmentCategories:Category[] = ['story','dare','vote','duel','lucky','sing','story','dare']
const levelLabels:Record<Level,string> = {chill:'สายชิล',fun:'สายฮา',wild:'สุดปั่น'}
function pickRandom<T,>(array:T[]):T { return array[Math.floor(Math.random()*array.length)] }
function tone(freq=520, duration=.12) {
 try {const Ctx=window.AudioContext; if(!Ctx)return; const ctx=new Ctx(); const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.08,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration);setTimeout(()=>void ctx.close(),500)} catch {/* Audio unavailable */ }
}
function Wheel({angle,spinning,enabled}:{angle:number;spinning:boolean;enabled:Category[]}) {
 const displayed = segmentCategories.map((c,i)=>enabled.includes(c)?c:enabled[i%enabled.length])
 return <div className="wheel-wrap">
  <div className="pointer" aria-hidden="true"/>
  <svg className="wheel" viewBox="0 0 320 320" role="img" aria-label="วงล้อสุ่มภารกิจ 8 ช่อง" style={{transform:`rotate(${angle}deg)`,transition:spinning?'transform 4.3s cubic-bezier(.11,.8,.13,1)':'none'}}>
    <circle cx="160" cy="160" r="155" fill="#27163b" stroke="#d48bff" strokeWidth="5"/>
    {displayed.map((cat,i)=>{
      const a=(i*45-90)*Math.PI/180,b=((i+1)*45-90)*Math.PI/180,m=((i+.5)*45-90)*Math.PI/180
      const x=160+102*Math.cos(m),y=160+102*Math.sin(m)
      const label=categories.find(c=>c.id===cat)!
      return <g key={i}>
        <path d={`M160 160 L${160+149*Math.cos(a)} ${160+149*Math.sin(a)} A149 149 0 0 1 ${160+149*Math.cos(b)} ${160+149*Math.sin(b)} Z`} fill={wheelColors[i]} stroke="#241132" strokeWidth="2"/>
        <text x={x} y={y-5} fill="white" textAnchor="middle" fontSize="22">{label.icon}</text>
        <text x={x} y={y+16} fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">{label.label}</text>
      </g>
    })}
    <circle cx="160" cy="160" r="31" fill="#170f2a" stroke="#f9b5ff" strokeWidth="5"/>
    <text x="160" y="169" textAnchor="middle" fontSize="27" fill="white">✦</text>
  </svg>
 </div>
}
function App(){
 const game=useGame()
 const [page,setPage]=useState<Page>('home')
 const [newName,setNewName]=useState('')
 const [angle,setAngle]=useState(0)
 const [spinning,setSpinning]=useState(false)
 const [result,setResult]=useState<Challenge|null>(null)
 const [lastIds,setLastIds]=useState<string[]>([])
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null)
 const player=game.players.length?game.players[game.turn%game.players.length]:'ผู้เล่น'
 const activeCategories=useMemo(()=>segmentCategories.map((c,i)=>game.enabled.includes(c)?c:game.enabled[i%game.enabled.length]),[game.enabled])
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[])
 const spin=()=>{
   if(spinning||result||!game.players.length)return
   const segment=Math.floor(Math.random()*sectors)
   const cat=activeCategories[segment]
   const eligible=challenges.filter(c=>c.category===cat&&c.level.includes(game.level))
   const fresh=eligible.filter(c=>!lastIds.includes(c.id))
   const selected=pickRandom(fresh.length?fresh:eligible)
   if(!selected)return
   const desired=(360-(segment+.5)*45)%360
   const current=((angle%360)+360)%360
   const delta=(desired-current+360)%360
   setSpinning(true)
   setAngle(v=>v+1800+delta)
   if(game.sound)tone(400,.2)
   timer.current=setTimeout(()=>{setSpinning(false);setResult(selected);setLastIds(prev=>[selected.id,...prev].slice(0,24));if(game.sound)tone(880,.35)},4400)
 }
 const finish=(outcome:'done'|'skip')=>{
   if(!result)return
   game.addRecord({id:crypto.randomUUID(),player,category:result.category,text:result.text,time:Date.now(),outcome})
   game.nextTurn();setResult(null)
 }
 const Header=({title,back='home'}:{title:string;back?:Page})=><div className="subhead"><button className="icon-btn" onClick={()=>setPage(back)} aria-label="ย้อนกลับ"><ArrowLeft size={21}/></button><h2>{title}</h2><span style={{width:40}}/></div>
 return <main className="app-shell"><div className="orb orb-one"/><div className="orb orb-two"/>
 <div className="content">
 <AnimatePresence mode="wait">
 {page==='home'&&<motion.section key="home" className="page home" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
  <div className="topline"><span className="eyebrow">✦ CHAOS WHEEL</span><button className="icon-btn" onClick={()=>setPage('settings')} aria-label="ตั้งค่า"><Settings2 size={21}/></button></div>
  <div className="hero"><div className="hero-symbol">🎡</div><span className="pill">PARTY GAME • SINGLE DEVICE</span><h1>วงล้อ<br/><em>ชะตาขาด</em></h1><p>หมุนหนึ่งที มีเรื่องทั้งวง!<br/>ใครจะเจอภารกิจสุดปั่นเป็นคนต่อไป?</p></div>
  <div className="hero-preview"><div className="preview-ring"><div className="preview-center">✦</div></div><div className="preview-label"><Sparkles size={16}/> สนุกทุกครั้งที่หมุน</div></div>
  <button className="primary big" onClick={()=>setPage('players')}>เริ่มปาร์ตี้ <ArrowRight size={21}/></button>
  <div className="home-actions"><button onClick={()=>setPage('history')}><History size={18}/> ประวัติการเล่น</button><button onClick={()=>setPage('settings')}><Settings2 size={18}/> ตั้งค่าเกม</button></div>
  <p className="muted center">เล่นบนมือถือเครื่องเดียว • ไม่ต้องสมัครสมาชิก</p>
 </motion.section>}
 {page==='players'&&<motion.section key="players" className="page" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
  <Header title="จัดทีมตัวปั่น"/>
  <div className="section-heading"><div className="section-emoji">👥</div><h1>ใครอยู่ในวงบ้าง?</h1><p>เพิ่มชื่อเพื่อนก่อนเริ่มหมุนวงล้อ</p></div>
  <div className="panel"><div className="panel-head"><h3>ผู้เล่นทั้งหมด</h3><span className="count">{game.players.length}/20 คน</span></div>
   <div className="player-list">{game.players.map((name,i)=><div className="player-row" key={i}><span className="avatar">{['😎','🤩','😈','🥳','🤠','👻'][i%6]}</span><span>{name}</span><button className="icon-btn danger" onClick={()=>game.removePlayer(i)} aria-label={`ลบ ${name}`}><X size={17}/></button></div>)}</div>
   <form className="add-player" onSubmit={e=>{e.preventDefault();if(newName.trim()&&!game.players.includes(newName.trim())&&game.players.length<20){game.addPlayer(newName);setNewName('')}}}><input value={newName} maxLength={22} onChange={e=>setNewName(e.target.value)} placeholder="พิมพ์ชื่อเพื่อน..." aria-label="ชื่อผู้เล่น"/><button type="submit" disabled={!newName.trim()||game.players.length>=20} aria-label="เพิ่มผู้เล่น"><Plus size={21}/></button></form>
  </div>
  <div className="panel"><h3>ระดับความปั่น</h3><div className="level-list">{([['chill','🌿','สายชิล','คำถามเบา ๆ เล่นได้ทุกคน'],['fun','🔥','สายฮา','ภารกิจสนุก ฮากันทั้งวง'],['wild','⚡','สุดปั่น','ท้าทายและกล้าแสดงออก']] as const).map(([id,icon,label,desc])=><button className={`level ${game.level===id?'selected':''}`} key={id} onClick={()=>game.setLevel(id)}><span className="level-emoji">{icon}</span><span className="level-text"><strong>{label}</strong><small>{desc}</small></span><span className="radio-dot">{game.level===id&&<Check size={13}/>}</span></button>)}</div></div>
  <button className="primary big sticky-action" disabled={!game.players.length} onClick={()=>setPage('game')}>ไปหมุนวงล้อ <ChevronRight size={20}/></button>
 </motion.section>}
 {page==='game'&&<motion.section key="game" className="page game-page" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
  <div className="topline"><button className="icon-btn" onClick={()=>setPage('home')} aria-label="หน้าหลัก"><ArrowLeft size={21}/></button><span className="eyebrow">CHAOS WHEEL</span><button className="icon-btn" onClick={()=>setPage('settings')} aria-label="ตั้งค่า"><Settings2 size={21}/></button></div>
  <div className="round-info"><span className="pill">รอบที่ {game.history.length+1}</span><p>ถึงตาของ</p><h2>{player} <span>⚡</span></h2><small>ระดับ {levelLabels[game.level]}</small></div>
  <Wheel angle={angle} spinning={spinning} enabled={game.enabled}/>
  <p className="wheel-hint">{spinning?'ชะตากำลังเลือก...':result?'ได้ภารกิจแล้ว!':'แตะปุ่มเพื่อหมุนวงล้อ'}</p>
  <button className="primary big spin-button" onClick={spin} disabled={spinning||!!result||!game.players.length}>{spinning?<><RotateCcw className="rotating" size={22}/> กำลังหมุน...</>:<><Shuffle size={22}/> หมุนวงล้อ!</>}</button>
  <div className="game-footer"><button onClick={()=>setPage('players')}><Settings2 size={17}/> ผู้เล่น</button><button onClick={()=>setPage('history')}><History size={17}/> ประวัติ</button><button onClick={()=>game.setSound(!game.sound)}>{game.sound?<Volume2 size={17}/>:<VolumeX size={17}/>} เสียง</button></div>
 </motion.section>}
 {page==='settings'&&<motion.section key="settings" className="page" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
  <Header title="ตั้งค่าเกม" back={game.players.length?'game':'home'}/>
  <div className="section-heading"><div className="section-emoji">⚙️</div><h1>ปรับแต่งความปั่น</h1><p>เลือกหมวดที่อยากให้ปรากฏบนวงล้อ</p></div>
  <div className="panel"><h3>หมวดภารกิจ</h3><p className="muted">เลือกอย่างน้อย 1 หมวด</p><div className="category-list">{categories.map(c=><button className="category-row" key={c.id} onClick={()=>game.toggleCategory(c.id)}><span className="category-emoji" style={{background:c.color+'35'}}>{c.icon}</span><strong>{c.label}</strong><span className={`toggle ${game.enabled.includes(c.id)?'on':''}`}><i/></span></button>)}</div></div>
  <div className="panel"><div className="setting-line"><span><Music2 size={19}/> เสียงเอฟเฟกต์</span><button className={`toggle ${game.sound?'on':''}`} onClick={()=>game.setSound(!game.sound)} aria-label="เปิดปิดเสียง"><i/></button></div></div>
  <div className="panel"><h3>จัดการข้อมูล</h3><button className="secondary full" onClick={()=>{if(window.confirm('ล้างประวัติการเล่นทั้งหมด?'))game.clearHistory()}}>ล้างประวัติการเล่น</button><button className="secondary full" onClick={()=>{if(window.confirm('คืนค่าผู้เล่นและการตั้งค่าทั้งหมด?')){game.reset();setPage('home')}}}>คืนค่าเริ่มต้น</button></div>
  <button className="primary big" onClick={()=>setPage('game')}>กลับไปเล่น <ArrowRight size={20}/></button>
 </motion.section>}
 {page==='history'&&<motion.section key="history" className="page" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
  <Header title="ประวัติการเล่น" back="game"/><div className="section-heading"><div className="section-emoji">🏆</div><h1>ตำนานประจำวง</h1><p>บันทึกภารกิจ {game.history.length} รอบล่าสุด</p></div>
  {game.history.length===0?<div className="panel empty"><History size={38}/><h3>ยังไม่มีประวัติ</h3><p>หมุนวงล้อแล้วทำภารกิจเพื่อเริ่มสะสมเรื่องราว</p></div>:<div className="history-list">{game.history.map((item,i)=><div className="panel history-item" key={item.id}><div className="history-top"><span className="count">#{game.history.length-i}</span><strong>{item.player}</strong><span className={`outcome ${item.outcome}`}>{item.outcome==='done'?'สำเร็จ':'ข้าม'}</span></div><p>{item.text}</p><small>{new Date(item.time).toLocaleString('th-TH')}</small></div>)}</div>}
  <button className="primary big" onClick={()=>setPage('game')}>กลับไปหมุน <ArrowRight size={20}/></button>
 </motion.section>}
 </AnimatePresence>
 </div>
 <AnimatePresence>{result&&page==='game'&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.div className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title" initial={{scale:.8,y:35,opacity:0}} animate={{scale:1,y:0,opacity:1}} exit={{scale:.9,opacity:0}}><div className="confetti">✦ ✧ ✦ ✧ ✦</div><div className="result-emoji">{categories.find(c=>c.id===result.category)?.icon}</div><span className="pill">{categories.find(c=>c.id===result.category)?.label}</span><h2 id="result-title">{player} โดนแล้ว!</h2><p className="result-text">{result.text}</p><div className="result-actions"><button className="primary" onClick={()=>finish('done')}><Check size={19}/> ทำสำเร็จ / ไปต่อ</button><button className="secondary" onClick={()=>finish('skip')}><Minus size={18}/> ข้ามภารกิจ</button></div><small>เล่นเพื่อความสนุก ทุกคนมีสิทธิ์ข้ามได้เสมอ</small></motion.div></motion.div>}</AnimatePresence>
 </main>
}
export default App
