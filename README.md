# 🎡 วงล้อชะตาขาด (Chaos Wheel)

เกมปาร์ตี้ Neon Party สำหรับเล่นบนมือถือเครื่องเดียว สร้างด้วย React + Vite + TypeScript + Tailwind CSS + Motion + Zustand

## เริ่มใช้งาน
```bash
bun install
bun run dev
```
เปิด URL ที่ Vite แสดง (ปกติ http://localhost:5173)

ถ้าใช้ npm:
```bash
npm install
npm run dev
```

## Build และ Deploy
```bash
bun run build
bun run preview
```
บน Vercel: Import Git Repository, Framework Preset = Vite, Build Command = `bun run build` (หรือ `npm run build`), Output Directory = `dist`.

## ฟีเจอร์
- หน้า Home สไตล์ม่วงชมพู Neon
- เพิ่มและลบผู้เล่นได้สูงสุด 20 คน
- เลือก 3 ระดับความปั่น
- วงล้อ 8 ช่องพร้อมแอนิเมชันหยุดตรงช่องที่สุ่ม
- คลังโจทย์ 90+ ข้อ แยก 6 หมวด
- เลือกเปิด/ปิดหมวด (ต้องเหลืออย่างน้อย 1 หมวด)
- ผลลัพธ์เป็นการ์ด พร้อมปุ่มสำเร็จหรือข้าม
- เล่นผลัดกันตามลำดับชื่อ
- ประวัติ 100 รอบล่าสุด
- เก็บค่าผู้เล่นและประวัติใน localStorage
- เปิดปิดเสียงสั้น ๆ ที่สร้างด้วย Web Audio API
- ไม่มี Backend ไม่มีบัญชีผู้ใช้

## โครงสร้าง
- `src/App.tsx` — หน้าจอทั้งหมดและลอจิกวงล้อ
- `src/data.ts` — ประเภทเกมและคลังภารกิจ
- `src/store.ts` — Zustand store พร้อม localStorage
- `src/styles.css` — ดีไซน์และ Responsive UI

## หมายเหตุ
- อนิเมชันวงล้อใช้เวลา 4.3 วินาที ผลลัพธ์ถูกสุ่มก่อนเริ่มหมุนเพื่อให้ตรงกับตำแหน่งที่หยุด
- เสียงอาจไม่ทำงานบนอุปกรณ์บางรุ่นจนกว่าจะมีการแตะหน้าจอ
- ฟอนต์ Kanit โหลดจาก Google Fonts หากออฟไลน์จะใช้ฟอนต์สำรอง
- เกมนี้ไม่มีการบังคับดื่มและผู้เล่นข้ามภารกิจได้ทุกเมื่อ
