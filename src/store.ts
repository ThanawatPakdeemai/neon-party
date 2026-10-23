import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { categories, type Category, type Level } from './data'
export type RecordItem = { id:string; player:string; category:Category; text:string; time:number; outcome:'done'|'skip' }
type State = {
 players:string[]; level:Level; enabled:Category[]; history:RecordItem[]; sound:boolean; turn:number;
 addPlayer:(name:string)=>void; removePlayer:(index:number)=>void; setLevel:(level:Level)=>void;
 toggleCategory:(id:Category)=>void; setSound:(v:boolean)=>void;
 addRecord:(item:RecordItem)=>void; nextTurn:()=>void; clearHistory:()=>void; reset:()=>void;
}
export const useGame = create<State>()(persist((set)=>({
 players:['บอล','บาส','ต้น','เจ'],level:'fun',enabled:categories.map(x=>x.id),history:[],sound:true,turn:0,
 addPlayer:name=>set(s=>({players:[...s.players,name.trim()].filter(Boolean).slice(0,20)})),
 removePlayer:index=>set(s=>({players:s.players.filter((_,i)=>i!==index),turn:0})),
 setLevel:level=>set({level}),toggleCategory:id=>set(s=>({enabled:s.enabled.includes(id)?(s.enabled.length>1?s.enabled.filter(x=>x!==id):s.enabled):[...s.enabled,id]})),
 setSound:sound=>set({sound}),addRecord:item=>set(s=>({history:[item,...s.history].slice(0,100)})),
 nextTurn:()=>set(s=>({turn:s.turn+1})),clearHistory:()=>set({history:[]}),
 reset:()=>set({players:['บอล','บาส','ต้น','เจ'],level:'fun',enabled:categories.map(x=>x.id),history:[],sound:true,turn:0})
}),{name:'chaos-wheel-v1'}))
