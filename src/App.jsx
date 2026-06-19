import { useState, useMemo } from "react";

// ── ฟุตเตอร์: ใส่รูปโปรไฟล์ของคุณที่ public/logo.jpg (วงกลม) ถ้าไม่มีจะโชว์ตรา MC ให้แทน
const FB_URL = "https://www.facebook.com/momentswithclaude";

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
        ใส่<b className="text-stone-600">ราคา</b>กับ<b className="text-stone-600">ปริมาณ</b>ของสินค้าสองอันที่ขนาดอาจไม่เท่ากัน
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
            src="/logo.jpg"
            alt="Moments with Claude"
            onError={() => setImgOk(false)}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-stone-200"
          />
        ) : (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-[13px] font-bold text-white ring-1 ring-stone-200">
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
  const [tab, setTab] = useState("c1");

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
          {tabBtn("c1", "ราคา + ปริมาณ", "รู้ราคาและปริมาณรวม")}
          {tabBtn("c2", "ราคา + จำนวน + ขนาด", "ของขายเป็นแพ็ก/หลายชิ้น")}
        </div>

        <main>
          {tab === "c1" && <Calc1 />}
          {tab === "c2" && <Calc2 />}
        </main>

        <Footer />
      </div>
    </div>
  );
}
