const v = JSON.parse(localStorage.getItem("vehicleData"));
const b = JSON.parse(localStorage.getItem("basicCoverage"));
const a = JSON.parse(localStorage.getItem("addonCoverage"));
const l = JSON.parse(localStorage.getItem("liabilityCoverage"));
const d = JSON.parse(localStorage.getItem("discounts"));

const calc = {};
calc.IDV = v.exShowroom * 0.95;
const cleanIDV = Math.floor(calc.IDV);

const zoneRates = {
  A: v.cc <=1000 ? 0.03127 : v.cc<=1500 ? 0.03283 : 0.03440,
  B: v.cc <=1000 ? 0.03039 : v.cc<=1500 ? 0.03191 : 0.03343
};
calc.ownDamage = calc.IDV * zoneRates[v.zone];
calc.elecAcc = v.electricAccessories * 0.04;
calc.basicOD1 = calc.ownDamage + calc.elecAcc;

calc.zeroDep = b.zeroDep ? (v.fuel==="diesel"?0.56:0.37)*(calc.IDV+v.electricAccessories)/100 : 0;

if (b.engineProtect) {
  const rate = v.fuel==="diesel"?0.0019:0.0016;
  let ep = rate * calc.IDV;
  let discount=0, loading=0;
  if (v.cc<=1500) discount += 0.10;
  if (calc.IDV <= 1000000) discount += 0.10;
  if (discount>0.15) discount=0.15;
  if (v.cc>=2500) loading += 0.10;
  if (calc.IDV>=2000000) loading += 0.10;
  if (loading>0.15) loading=0.15;
  calc.epCover = ep + ep * (loading - discount);
} else {
  calc.epCover = 0;
}

calc.rti = b.rti ? calc.IDV * 0.003 : 0;
calc.consumables = b.consumables ? (calc.IDV+v.electricAccessories)*0.001 : 0;

calc.keyReplace = b.keyReplacement
  ? (cleanIDV <= 600000 ? 250 :
     cleanIDV <= 1200000 ? 300 :
     cleanIDV <= 2500000 ? 400 : 500)
  : 0;

const uwAmt = d.uwDiscount * calc.basicOD1 / 100;
const zdAmt = (d.zeroDepDiscount / 100) * calc.zeroDep;
const atAmt = d.antiTheft ? (calc.basicOD1 + calc.epCover - uwAmt) * 0.025 : 0;

calc.cngOd = b.cngOd ? ((calc.basicOD1 + calc.epCover - uwAmt) * 0.05) : 0;

calc.personalEffects = a.personalEffects > 0 ? (a.personalEffects==5000?400:650) : 0;
calc.geoAreaA = a.geoArea ? 400 : 0;
calc.towing = a.towing ? a.towing * 0.05 : 0;
calc.tyreRim = a.tyreRim ? v.invoice * 0.002 : 0;
calc.emiProt = a.emiProtect ? a.emiAmount * (a.emiMonths==1?0.07:0.12) : 0;
calc.altCar = a.altCar ? (a.altCarDays==5?250:a.altCarDays==10?400:550) : 0;
calc.payDrive = a.payAsDrive ? calc.IDV * 0.0015 : 0;

calc.ownDamageTotal = calc.basicOD1 + calc.zeroDep + calc.epCover + calc.rti +
  calc.consumables + calc.keyReplace + calc.cngOd + calc.personalEffects +
  calc.geoAreaA + calc.towing + calc.tyreRim + calc.emiProt + calc.altCar + calc.payDrive
  - (uwAmt + zdAmt + atAmt);

const tpBasic = v.cc<=1000 ? 6521 : v.cc<=1500 ? 10640 : 24596;
calc.tp = tpBasic +
  (l.paOwner ? (l.paDuration==1?320:900) : 0) +
  (l.llEmployee ? l.empCount * 150 : 0) +
  (l.llDriver ? 150 : 0) +
  (l.paPassenger ? 150 : 0) +
  100 + 60;

calc.totalNoGST = calc.ownDamageTotal + calc.tp;
calc.gst = calc.totalNoGST * 0.18;
calc.total = calc.totalNoGST + calc.gst;

function formatRow(label, value) {
  return `<tr><td>${label}</td><td>₹${value.toFixed(2)}</td></tr>`;
}

let odHTML = '';
odHTML += formatRow("Basic OD", calc.basicOD1);
if (calc.zeroDep) odHTML += formatRow("Zero Depreciation", calc.zeroDep);
if (calc.epCover) odHTML += formatRow("Engine Protect Cover", calc.epCover);
if (calc.rti) odHTML += formatRow("Return to Invoice", calc.rti);
if (calc.consumables) odHTML += formatRow("Consumables Cover", calc.consumables);
if (calc.keyReplace) odHTML += formatRow("Key Replacement", calc.keyReplace);
if (calc.cngOd) odHTML += formatRow("Inbuilt CNG OD Cover", calc.cngOd);
if (calc.personalEffects) odHTML += formatRow("Personal Effects", calc.personalEffects);
if (calc.geoAreaA) odHTML += formatRow("Geographical Area (OD)", calc.geoAreaA);
if (calc.towing) odHTML += formatRow("Towing Charges", calc.towing);
if (calc.tyreRim) odHTML += formatRow("Tyre & Rim", calc.tyreRim);
if (calc.emiProt) odHTML += formatRow("EMI Protector", calc.emiProt);
if (calc.altCar) odHTML += formatRow("Alt Car Benefit", calc.altCar);
if (calc.payDrive) odHTML += formatRow("Pay As You Drive", calc.payDrive);
odHTML += formatRow("U/W Discount", -uwAmt);
odHTML += formatRow("Zero Dep Discount", -zdAmt);
odHTML += formatRow("Anti Theft Discount", -atAmt);
document.getElementById("odTable").innerHTML = odHTML;

let tpHTML = '';
tpHTML += formatRow("Basic TP Premium", tpBasic);
if (l.paOwner) tpHTML += formatRow(`PA Owner (${l.paDuration} yr)`, l.paDuration==1?320:900);
if (l.llEmployee) tpHTML += formatRow(`LL Employee (${l.empCount})`, l.empCount*150);
if (l.llDriver) tpHTML += formatRow("LL Paid Driver", 150);
if (l.paPassenger) tpHTML += formatRow("PA Unnamed Passenger", 150);
tpHTML += formatRow("Geo Area (TP)", 100);
tpHTML += formatRow("CNG KIT TP Cover", 60);
document.getElementById("tpTable").innerHTML = tpHTML;

document.getElementById("odTotal").innerText = `₹${calc.ownDamageTotal.toFixed(2)}`;
document.getElementById("tpTotal").innerText = `₹${calc.tp.toFixed(2)}`;
document.getElementById("gstAmt").innerText = `₹${calc.gst.toFixed(2)}`;
document.getElementById("finalTotal").innerHTML = `<strong>₹${calc.total.toFixed(2)}</strong>`;

