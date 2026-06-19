import { useState, useMemo } from "react";

// ── ฟุตเตอร์: รูปฝังเป็น data URI ในไฟล์นี้เลย (เปลี่ยนรูปได้โดยแก้ค่า LOGO ด้านล่าง)
const FB_URL = "https://www.facebook.com/momentswithclaude";
const LOGO = "data:image/jpeg;base64,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";

/* ───────────────────────── ตรรกะการเทียบราคา ─────────────────────────
   หัวใจของทั้งสองสูตรเหมือนกัน: ลดทุกอย่างให้เหลือ "ราคาต่อ 1 หน่วย"
   แล้วเทียบว่าใครต่อหน่วยถูกกว่า + ถูกกว่ากี่ %
   สูตร 1: หน่วย = ปริมาณรวมที่กรอกมาตรง ๆ
   สูตร 2: หน่วย = จำนวนชิ้น × ขนาดต่อชิ้น
----------------------------------------------------------------------- */

// แปลงเป็นตัวเลข (ค่าว่าง/ไม่ใช่เลข = null)
function num(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// จัดระดับความต่างเป็นคำพูดที่อ่านเข้าใจง่าย ตาม % ที่ถูกกว่า
function verdictBand(pct) {
  if (pct < 0.5)
    return { label: "แทบไม่ต่างกัน", tip: "ราคาพอ ๆ กัน เลือกตามสะดวก/ความชอบได้เลย", tone: "slate" };
  if (pct < 3)
    return { label: "ถูกกว่านิดเดียว", tip: "ต่างกันเล็กน้อย ถ้าปัจจัยอื่นต่างกันก็พิจารณาอย่างอื่นด้วย", tone: "slate" };
  if (pct < 8)
    return { label: "ถูกกว่าพอสมควร", tip: "เริ่มเห็นความคุ้มชัดขึ้น โดยเฉพาะถ้าซื้อบ่อย", tone: "emerald" };
  if (pct < 20)
    return { label: "ถูกกว่าชัดเจน", tip: "คุ้มกว่าเห็น ๆ แนะนำตัวที่ถูกกว่า", tone: "emerald" };
  return { label: "ถูกกว่ามาก", tip: "ต่างกันเยอะ เลือกตัวถูกกว่าได้สบายใจ", tone: "emerald" };
}

// คำนวณผลเทียบจากราคาต่อหน่วยของ A และ B
function compare(perA, perB, unit) {
  if (perA === null || perB === null) return null;
  if (perA <= 0 || perB <= 0) return { error: "ราคาและปริมาณต้องมากกว่า 0" };

  const cheaper = perA < perB ? "A" : perB < perA ? "B" : "tie";
  const lo = Math.min(perA, perB);
  const hi = Math.max(perA, perB);

  const savePct = hi === 0 ? 0 : ((hi - lo) / hi) * 100;   // ประหยัดได้กี่ % ถ้าเลือกตัวถูก
  const moreExpPct = lo === 0 ? 0 : ((hi - lo) / lo) * 100; // ตัวแพงแพงกว่าตัวถูกกี่ %
  const diffPerUnit = hi - lo;

  return {
    cheaper, perA, perB, lo, hi, savePct, moreExpPct, diffPerUnit, unit,
    band: verdictBand(savePct),
    barA: (perA / hi) * 100,
    barB: (perB / hi) * 100,
  };
}

// จัดรูปตัวเลขให้อ่านง่าย
function fmt(n, max = 4) {
  if (n === null || n === undefined || !Number.isFinite(n)) return "–";
  const abs = Math.abs(n);
  let digits = 2;
  if (abs !== 0 && abs < 1) digits = Math.min(max, 4);
  if (abs >= 1000) digits = 0;
  return n.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: digits });
}
const baht = (n, d) => "฿" + fmt(n, d);

/* ───────────────────────── ส่วนประกอบ UI ย่อย ───────────────────────── */

function Field({ label, value, onChange, placeholder, suffix, focusClass }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-stone-500">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-[15px] text-stone-800 shadow-sm outline-none transition placeholder:text-stone-300 ${focusClass}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-stone-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function ProductCard({ name, dotClass, children }) {
  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-lg text-[13px] font-bold text-white ${dotClass}`}>
          {name}
        </span>
        <span className="text-sm font-semibold text-stone-700">สินค้า {name}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// แถบเทียบราคาต่อหน่วยของทั้งสองตัว
function PerUnitBars({ r, unitLabel }) {
  const Row = ({ k, val, bar, win }) => {
    const isA = k === "A";
    const barColor = win ? "bg-emerald-500" : isA ? "bg-sky-500" : "bg-amber-500";
    const dot = isA ? "bg-sky-500" : "bg-amber-500";
    return (
      <div className="space-y-1">
        <div className="flex items-baseline justify-between text-sm">
          <span className="flex items-center gap-1.5 font-medium text-stone-600">
            <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
            {k} · ราคาต่อ 1 {unitLabel}
            {win && (
              <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                ถูกกว่า
              </span>
            )}
          </span>
          <span className={`font-semibold tabular-nums ${win ? "text-emerald-700" : "text-stone-700"}`}>
            {baht(val)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.max(bar, 3)}%` }}
          />
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-3">
      <Row k="A" val={r.perA} bar={r.barA} win={r.cheaper === "A"} />
      <Row k="B" val={r.perB} bar={r.barB} win={r.cheaper === "B"} />
    </div>
  );
}

// กล่องสรุปผลหลัก
function Result({ r, unitLabel, extras }) {
  if (!r) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 px-4 py-8 text-center text-sm text-stone-400">
        กรอกราคาและปริมาณของทั้งสองตัวให้ครบ แล้วผลเทียบจะขึ้นตรงนี้
      </div>
    );
  }
  if (r.error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-600">
        {r.error}
      </div>
    );
  }

  if (r.cheaper === "tie") {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-stone-700">เท่ากันพอดี</div>
          <p className="mt-1 text-sm text-stone-500">
            ราคาต่อ 1 {unitLabel} เท่ากันที่ {baht(r.lo)} — เลือกอันไหนก็คุ้มเท่ากัน
          </p>
        </div>
        <div className="mt-4"><PerUnitBars r={r} unitLabel={unitLabel} /></div>
      </div>
    );
  }

  const winner = r.cheaper;
  const loser = winner === "A" ? "B" : "A";
  const band = r.band;
  const accentRing = winner === "A" ? "ring-sky-200" : "ring-amber-200";

  return (
    <div className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ring-1 ${accentRing}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-base font-bold text-white">
            {winner}
          </span>
          <div className="leading-tight">
            <div className="text-lg font-bold text-stone-800">สินค้า {winner} คุ้มกว่า</div>
            <div className="text-[13px] text-stone-500">เทียบกันที่ราคาต่อ 1 {unitLabel}</div>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[13px] font-semibold ${
            band.tone === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"
          }`}
        >
          {band.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 px-3 py-3 text-center">
          <div className="text-[12px] font-medium text-emerald-700">เลือก {winner} ประหยัด</div>
          <div className="text-2xl font-bold text-emerald-700 tabular-nums">{fmt(r.savePct, 1)}%</div>
        </div>
        <div className="rounded-xl bg-stone-50 px-3 py-3 text-center">
          <div className="text-[12px] font-medium text-stone-500">{loser} แพงกว่า {winner}</div>
          <div className="text-2xl font-bold text-stone-700 tabular-nums">{fmt(r.moreExpPct, 1)}%</div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        ราคาต่อ 1 {unitLabel}: <b className="text-stone-800">A {baht(r.perA)}</b> ·{" "}
        <b className="text-stone-800">B {baht(r.perB)}</b>. สินค้า{" "}
        <b className="text-emerald-700">{winner} ถูกกว่า {fmt(r.savePct, 1)}%</b>{" "}
        (ต่างกัน {baht(r.diffPerUnit)} ต่อ {unitLabel}). {band.tip}
      </p>

      <div className="mt-4"><PerUnitBars r={r} unitLabel={unitLabel} /></div>

      {extras && extras.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-stone-100 pt-3 text-[13px]">
          {extras.map((e, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-stone-500">{e.label}</span>
              <span className="font-medium text-stone-700 tabular-nums">{e.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── สูตร 1: ราคา + ปริมาณ ───────────────────────── */

function Calc1() {
  const [pa, setPa] = useState("135");
  const [qa, setQa] = useState("2000");
  const [pb, setPb] = useState("111");
  const [qb, setQb] = useState("1850");
  const [unit, setUnit] = useState("มล.");

  const r = useMemo(() => {
    const PA = num(pa), QA = num(qa), PB = num(pb), QB = num(qb);
    if (PA === null || QA === null || PB === null || QB === null) return null;
    if (QA <= 0 || QB <= 0) return { error: "ปริมาณต้องมากกว่า 0" };
    return compare(PA / QA, PB / QB, unit || "หน่วย");
  }, [pa, qa, pb, qb, unit]);

  const unitLabel = unit || "หน่วย";

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-stone-500">
        ใส่<b className="text-stone-600">ราคา</b>กับ<b className="text-stone-600">ปริมาณ</b>ของสินค้าสองตัวที่ขนาดอาจไม่เท่ากัน
        แล้วระบบจะเทียบให้ว่าอันไหนถูกกว่าเมื่อคิดที่ปริมาณเท่ากัน
      </p>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-stone-500">หน่วยของปริมาณ:</span>
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="เช่น มล. / กรัม / ชิ้น"
          className="w-40 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-stone-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ProductCard name="A" dotClass="bg-sky-500">
          <Field label="ราคา" value={pa} onChange={setPa} placeholder="0" suffix="บาท" focusClass="focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
          <Field label={`ปริมาณรวม (${unitLabel})`} value={qa} onChange={setQa} placeholder="0" suffix={unitLabel} focusClass="focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </ProductCard>
        <ProductCard name="B" dotClass="bg-amber-500">
          <Field label="ราคา" value={pb} onChange={setPb} placeholder="0" suffix="บาท" focusClass="focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
          <Field label={`ปริมาณรวม (${unitLabel})`} value={qb} onChange={setQb} placeholder="0" suffix={unitLabel} focusClass="focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
        </ProductCard>
      </div>

      <Result r={r} unitLabel={unitLabel} />
    </div>
  );
}

/* ──────────────── สูตร 2: ราคา + จำนวนชิ้น + ขนาดต่อชิ้น ──────────────── */

function Calc2() {
  const [pa, setPa] = useState("135");
  const [na, setNa] = useState("6");
  const [sa, setSa] = useState("500");
  const [pb, setPb] = useState("111");
  const [nb, setNb] = useState("4");
  const [sb, setSb] = useState("600");
  const [unit, setUnit] = useState("มล.");

  const data = useMemo(() => {
    const PA = num(pa), NA = num(na), SA = num(sa);
    const PB = num(pb), NB = num(nb), SB = num(sb);
    if ([PA, NA, SA, PB, NB, SB].some((v) => v === null)) return null;
    if (NA <= 0 || SA <= 0 || NB <= 0 || SB <= 0)
      return { error: "จำนวนชิ้นและขนาดต่อชิ้นต้องมากกว่า 0" };
    const totalA = NA * SA;
    const totalB = NB * SB;
    const r = compare(PA / totalA, PB / totalB, unit || "หน่วย");
    return { r, totalA, totalB, PA, PB };
  }, [pa, na, sa, pb, nb, sb, unit]);

  const unitLabel = unit || "หน่วย";
  const r = data && !data.error ? data.r : data;

  const extras =
    data && data.r && !data.r.error
      ? [
          { label: "A · ปริมาณรวม", value: `${fmt(data.totalA, 0)} ${unitLabel}` },
          { label: "B · ปริมาณรวม", value: `${fmt(data.totalB, 0)} ${unitLabel}` },
          { label: "A · ราคารวม", value: baht(data.PA) },
          { label: "B · ราคารวม", value: baht(data.PB) },
        ]
      : null;

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-stone-500">
        เหมาะกับของที่ขายเป็นแพ็ก เช่น น้ำ 6 ขวด ขวดละ 500 มล. ระบบจะคูณ
        <b className="text-stone-600"> จำนวนชิ้น × ขนาดต่อชิ้น </b>เป็นปริมาณรวม แล้วเทียบราคาต่อหน่วยให้
      </p>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-stone-500">ขนาดต่อชิ้นเป็น:</span>
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="เช่น มล. / กรัม / แผ่น"
          className="w-40 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-stone-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ProductCard name="A" dotClass="bg-sky-500">
          <Field label="ราคา" value={pa} onChange={setPa} placeholder="0" suffix="บาท" focusClass="focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
          <Field label="จำนวนชิ้น" value={na} onChange={setNa} placeholder="0" suffix="ชิ้น" focusClass="focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
          <Field label={`ขนาดต่อชิ้น (${unitLabel})`} value={sa} onChange={setSa} placeholder="0" suffix={unitLabel} focusClass="focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </ProductCard>
        <ProductCard name="B" dotClass="bg-amber-500">
          <Field label="ราคา" value={pb} onChange={setPb} placeholder="0" suffix="บาท" focusClass="focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
          <Field label="จำนวนชิ้น" value={nb} onChange={setNb} placeholder="0" suffix="ชิ้น" focusClass="focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
          <Field label={`ขนาดต่อชิ้น (${unitLabel})`} value={sb} onChange={setSb} placeholder="0" suffix={unitLabel} focusClass="focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
        </ProductCard>
      </div>

      <Result r={r} unitLabel={unitLabel} extras={extras} />
    </div>
  );
}

/* ════════════ สูตร 3: คิดเปอร์เซ็นต์กับราคา (รวมทุกแบบ) ════════════ */

// ── ส่วนประกอบผลลัพธ์ที่ใช้ร่วมกันในทุกโหมด
function PctResultWrap({ children }) {
  return <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">{children}</div>;
}
function PctBig({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-emerald-50 px-4 py-4 text-center">
      <div className="text-[12px] font-medium text-emerald-700">{label}</div>
      <div className="text-3xl font-bold text-emerald-700 tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-[12px] leading-snug text-emerald-600">{sub}</div>}
    </div>
  );
}
function PctRows({ items }) {
  return (
    <div className="grid gap-2 text-sm sm:grid-cols-2">
      {items.filter(Boolean).map((it, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2">
          <span className="text-stone-500">{it.label}</span>
          <span className="font-semibold text-stone-700 tabular-nums">{it.value}</span>
        </div>
      ))}
    </div>
  );
}
function PctEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 px-4 py-8 text-center text-sm text-stone-400">
      กรอกตัวเลขให้ครบ แล้วผลจะขึ้นตรงนี้
    </div>
  );
}
function PctError({ msg }) {
  return <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-600">{msg}</div>;
}
function MiniToggle({ value, onChange, options }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl bg-stone-100 p-1 text-[13px]">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-lg px-3 py-1.5 font-medium transition ${
            value === o.v ? "bg-white text-teal-700 shadow-sm" : "text-stone-500 hover:text-stone-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* โหมด 1 — ลดราคา % (ใส่เพดานสูงสุดได้) → ตอบคำถาม "ลด 35% สูงสุด 1500 ซื้อได้เท่าไร" */
function ModeDiscount() {
  const [price, setPrice] = useState("");
  const [pct, setPct] = useState("35");
  const [cap, setCap] = useState("1500");

  const r = useMemo(() => {
    const P = num(price), d = num(pct), C = num(cap);
    if (d === null || d <= 0) return null;
    const hasCap = C !== null && C > 0;
    const threshold = hasCap ? (C * 100) / d : null; // ยอดซื้อที่ได้ส่วนลดเต็มเพดานพอดี
    let block = null;
    if (P !== null && P > 0) {
      const raw = (P * d) / 100;
      const discount = hasCap ? Math.min(raw, C) : raw;
      const final = P - discount;
      const eff = (discount / P) * 100;
      block = { raw, discount, final, eff, capped: hasCap && raw > C };
    }
    return { d, C, hasCap, threshold, block };
  }, [price, pct, cap]);

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-stone-500">
        ส่วนลดเป็น % แบบมี <b className="text-stone-600">เพดานสูงสุด</b> ได้ (เว้นช่องเพดานว่าง = ลดเต็ม % ไม่จำกัด)
        ใส่ยอดซื้อด้วยก็จะคิดราคาหลังลดให้ ถ้าไม่ใส่จะบอกว่าซื้อได้ถึงเท่าไรถึงได้ส่วนลดเต็มเพดาน
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="ลดกี่ %" value={pct} onChange={setPct} placeholder="0" suffix="%" focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
        <Field label="เพดานสูงสุด" value={cap} onChange={setCap} placeholder="ไม่จำกัด" suffix="บาท" focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
        <Field label="ยอดซื้อ (ถ้ามี)" value={price} onChange={setPrice} placeholder="ไม่ระบุ" suffix="บาท" focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
      </div>

      {!r ? (
        <PctEmpty />
      ) : (
        <PctResultWrap>
          {r.block ? (
            <>
              <PctBig label="ราคาหลังลด" value={baht(r.block.final)} sub={`ลดจริง ${fmt(r.block.eff, 1)}%`} />
              <PctRows
                items={[
                  { label: "ส่วนลดที่ได้", value: baht(r.block.discount) + (r.block.capped ? " (ชนเพดาน)" : "") },
                  r.block.capped ? { label: "ถ้าไม่มีเพดานจะลด", value: baht(r.block.raw) } : null,
                ]}
              />
            </>
          ) : r.hasCap ? (
            <PctBig
              label="ซื้อได้ถึง"
              value={baht(r.threshold)}
              sub={`ถึงจะได้ส่วนลดเต็ม ${fmt(r.d, 0)}% (= ${baht(r.C)} พอดี)`}
            />
          ) : (
            <PctBig label="ลด" value={`${fmt(r.d, 0)}%`} sub="ไม่มีเพดาน — ใส่ยอดซื้อเพื่อคิดราคาหลังลด" />
          )}

          {r.hasCap && (
            <p className="text-sm leading-relaxed text-stone-600">
              โปรนี้ลด <b className="text-stone-800">{fmt(r.d, 0)}%</b> แต่ส่วนลดไม่เกิน{" "}
              <b className="text-stone-800">{baht(r.C)}</b> → ซื้อได้ถึง{" "}
              <b className="text-emerald-700">{baht(r.threshold)}</b> จะได้ส่วนลดเต็ม % (ส่วนลด = {baht(r.C)} พอดี).
              ถ้าซื้อมากกว่านี้ ส่วนลดจะคงที่ที่ {baht(r.C)} เปอร์เซ็นต์ที่ได้จริงจะค่อย ๆ ลดลง
            </p>
          )}
        </PctResultWrap>
      )}
    </div>
  );
}

/* โหมด 2 — หาว่าลดกี่ % → ตอบคำถาม "ราคาเต็ม A กับส่วนลด B คิดเป็นกี่ %" */
function ModeFind() {
  const [full, setFull] = useState("");
  const [bType, setBType] = useState("disc"); // disc=ส่วนลด(บาท), final=ราคาหลังลด
  const [b, setB] = useState("");

  const r = useMemo(() => {
    const A = num(full), B = num(b);
    if (A === null || B === null) return null;
    if (A <= 0) return { error: "ราคาเต็มต้องมากกว่า 0" };
    let discount, final;
    if (bType === "disc") { discount = B; final = A - B; }
    else { final = B; discount = A - B; }
    if (discount < 0) return { error: bType === "final" ? "ราคาหลังลดมากกว่าราคาเต็ม" : "ส่วนลดมากกว่าราคาเต็ม" };
    return { A, discount, final, pct: (discount / A) * 100 };
  }, [full, b, bType]);

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-stone-500">
        รู้ราคาเต็มกับส่วนลด (หรือราคาหลังลด) แล้วอยากรู้ว่าลดไปกี่เปอร์เซ็นต์
      </p>
      <MiniToggle
        value={bType}
        onChange={setBType}
        options={[
          { v: "disc", label: "B = ส่วนลด (บาท)" },
          { v: "final", label: "B = ราคาหลังลด" },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="ราคาเต็ม (A)" value={full} onChange={setFull} placeholder="0" suffix="บาท" focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
        <Field
          label={bType === "disc" ? "ส่วนลด (B)" : "ราคาหลังลด (B)"}
          value={b}
          onChange={setB}
          placeholder="0"
          suffix="บาท"
          focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {!r ? (
        <PctEmpty />
      ) : r.error ? (
        <PctError msg={r.error} />
      ) : (
        <PctResultWrap>
          <PctBig label="ลดไป" value={`${fmt(r.pct, 1)}%`} />
          <PctRows
            items={[
              { label: "ส่วนลด", value: baht(r.discount) },
              { label: "ราคาหลังลด", value: baht(r.final) },
            ]}
          />
        </PctResultWrap>
      )}
    </div>
  );
}

/* โหมด 3 — เพิ่ม % / VAT (เพิ่มเข้า หรือ ถอดออก) */
function ModeAdd() {
  const [dir, setDir] = useState("add"); // add=เพิ่มเข้า, strip=ถอดออก
  const [price, setPrice] = useState("");
  const [pct, setPct] = useState("7");

  const r = useMemo(() => {
    const P = num(price), d = num(pct);
    if (P === null || d === null) return null;
    if (P < 0 || d < 0) return { error: "ค่าต้องไม่ติดลบ" };
    if (dir === "add") {
      const amt = (P * d) / 100;
      return { dir, base: P, amt, total: P + amt };
    }
    const base = P / (1 + d / 100);
    return { dir, base, amt: P - base, total: P };
  }, [price, pct, dir]);

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-stone-500">
        บวกเปอร์เซ็นต์เข้าไป (เช่น VAT 7% หรือขึ้นราคา) หรือถอดเปอร์เซ็นต์ออกจากราคาที่รวมแล้ว
      </p>
      <MiniToggle
        value={dir}
        onChange={setDir}
        options={[
          { v: "add", label: "เพิ่มเข้า" },
          { v: "strip", label: "ถอดออก" },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label={dir === "add" ? "ราคาก่อนเพิ่ม" : "ราคารวม (เพิ่มแล้ว)"}
          value={price}
          onChange={setPrice}
          placeholder="0"
          suffix="บาท"
          focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        />
        <Field label="เพิ่มกี่ %" value={pct} onChange={setPct} placeholder="0" suffix="%" focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
      </div>

      {!r ? (
        <PctEmpty />
      ) : r.error ? (
        <PctError msg={r.error} />
      ) : r.dir === "add" ? (
        <PctResultWrap>
          <PctBig label="ราคารวม" value={baht(r.total)} />
          <PctRows
            items={[
              { label: "ส่วนที่เพิ่ม", value: baht(r.amt) },
              { label: "ราคาก่อนเพิ่ม", value: baht(r.base) },
            ]}
          />
        </PctResultWrap>
      ) : (
        <PctResultWrap>
          <PctBig label="ราคาก่อนเพิ่ม" value={baht(r.base)} />
          <PctRows
            items={[
              { label: "ส่วนที่ถอดออก", value: baht(r.amt) },
              { label: "ราคารวม", value: baht(r.total) },
            ]}
          />
        </PctResultWrap>
      )}
    </div>
  );
}

/* โหมด 4 — คิด % ทั่วไป (X เป็นกี่% ของ Y / กี่% ของ Y) */
function ModeBasic() {
  const [kind, setKind] = useState("xofy"); // xofy: X เป็นกี่% ของ Y ; pofy: p% ของ Y
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [p, setP] = useState("");
  const [base, setBase] = useState("");

  const r = useMemo(() => {
    if (kind === "xofy") {
      const X = num(x), Y = num(y);
      if (X === null || Y === null) return null;
      if (Y === 0) return { error: "ฐาน (Y) ต้องไม่เป็น 0" };
      return { type: "xofy", value: (X / Y) * 100 };
    }
    const P = num(p), Y = num(base);
    if (P === null || Y === null) return null;
    return { type: "pofy", value: (Y * P) / 100 };
  }, [kind, x, y, p, base]);

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-stone-500">คิดเปอร์เซ็นต์พื้นฐาน เลือกแบบที่ต้องการ</p>
      <MiniToggle
        value={kind}
        onChange={setKind}
        options={[
          { v: "xofy", label: "X เป็นกี่ % ของ Y" },
          { v: "pofy", label: "กี่ % ของ Y" },
        ]}
      />

      {kind === "xofy" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="ค่า (X)" value={x} onChange={setX} placeholder="0" focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
          <Field label="ฐาน (Y)" value={y} onChange={setY} placeholder="0" focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="เปอร์เซ็นต์" value={p} onChange={setP} placeholder="0" suffix="%" focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
          <Field label="ฐาน (Y)" value={base} onChange={setBase} placeholder="0" focusClass="focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
        </div>
      )}

      {!r ? (
        <PctEmpty />
      ) : r.error ? (
        <PctError msg={r.error} />
      ) : r.type === "xofy" ? (
        <PctResultWrap>
          <PctBig label="X เป็น" value={`${fmt(r.value, 2)}%`} sub="ของ Y" />
        </PctResultWrap>
      ) : (
        <PctResultWrap>
          <PctBig label="คำตอบ" value={fmt(r.value, 2)} sub={`คือ ${fmt(num(p) || 0, 2)}% ของ ${fmt(num(base) || 0, 0)}`} />
        </PctResultWrap>
      )}
    </div>
  );
}

function Calc3() {
  const [mode, setMode] = useState("disc");
  const modes = [
    { v: "disc", label: "ลดราคา %" },
    { v: "find", label: "ลดกี่ %?" },
    { v: "add", label: "เพิ่ม % / VAT" },
    { v: "basic", label: "คิด % ทั่วไป" },
  ];
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-stone-500">
        รวมวิธีคิดเปอร์เซ็นต์กับราคาที่ใช้บ่อย เลือกแบบที่ต้องการด้านล่าง
      </p>
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.v}
            onClick={() => setMode(m.v)}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              mode === m.v ? "bg-teal-600 text-white shadow-sm" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      {mode === "disc" && <ModeDiscount />}
      {mode === "find" && <ModeFind />}
      {mode === "add" && <ModeAdd />}
      {mode === "basic" && <ModeBasic />}
    </div>
  );
}

/* ───────────────────────── ฟุตเตอร์ ───────────────────────── */

function Footer() {
  const [imgOk, setImgOk] = useState(true);
  return (
    <footer className="mt-10 pb-3">
      <a
        href={FB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mx-auto flex w-fit items-center gap-3 rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 transition hover:border-stone-300 hover:bg-white"
      >
        {imgOk ? (
          <img
            src={LOGO}
            alt="Moments with Claude"
            onError={() => setImgOk(false)}
            className="h-11 w-11 rounded-xl bg-white object-contain ring-1 ring-stone-200"
          />
        ) : (
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-[13px] font-bold text-white ring-1 ring-stone-200">
            MC
          </span>
        )}
        <div className="text-left leading-tight">
          <div className="text-[10px] uppercase tracking-wide text-stone-400">Powered by</div>
          <div className="text-sm font-semibold text-stone-700 group-hover:text-stone-900">
            Moments with Claude
          </div>
        </div>
      </a>
    </footer>
  );
}

/* ───────────────────────── หน้าหลัก ───────────────────────── */

export default function App() {
  const [tab, setTab] = useState("c2");

  const tabBtn = (id, label, hint) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className={`flex-1 rounded-xl px-3 py-2.5 text-left transition ${
          active ? "bg-white shadow-sm ring-1 ring-stone-200" : "hover:bg-white/50"
        }`}
      >
        <div className={`text-sm font-semibold ${active ? "text-teal-700" : "text-stone-600"}`}>{label}</div>
        <div className="text-[11px] text-stone-400">{hint}</div>
      </button>
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 px-4 py-8 text-stone-800"
      style={{ fontFamily: "'Noto Sans Thai', system-ui, sans-serif" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-6 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-600/10 px-3 py-1 text-[13px] font-medium text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> เทียบราคาให้รู้ว่าอันไหนคุ้ม
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">อันไหนคุ้มกว่า?</h1>
          <p className="mt-1.5 text-sm text-stone-500">
            เทียบราคาต่อหน่วยของสินค้า 2 ตัว · ดูว่าถูกกว่ากี่เปอร์เซ็นต์
          </p>
        </header>

        <div className="mb-5 flex gap-2 rounded-2xl bg-stone-100/80 p-1.5">
          {tabBtn("c2", "ราคา+จำนวน+ขนาด", "ของเป็นแพ็ก/หลายชิ้น")}
          {tabBtn("c3", "คิด % / ส่วนลด", "ลด · เพิ่ม · VAT")}
          {tabBtn("c1", "ราคา+ปริมาณ", "รู้ราคา+ปริมาณรวม")}
        </div>

        <main>
          {tab === "c1" && <Calc1 />}
          {tab === "c2" && <Calc2 />}
          {tab === "c3" && <Calc3 />}
        </main>

        <Footer />
      </div>
    </div>
  );
}
