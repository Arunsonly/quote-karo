const vehicleData = JSON.parse(localStorage.getItem("vehicleData") || "{}");
const cngOdInput = document.getElementById('cngOd');

if (vehicleData.fuel === "petrol" && vehicleData.cngLpg) {
  cngOdInput.checked = true;
}

function goBack() {
  window.location.href = 'private-car.html';
}

function goNext() {
  const coverages = {
    zeroDep: document.getElementById('zeroDep').checked,
    engineProtect: document.getElementById('engineProtect').checked,
    rti: document.getElementById('rti').checked,
    consumables: document.getElementById('consumables').checked,
    keyReplacement: document.getElementById('keyReplacement').checked,
    cngOd: cngOdInput.checked
  };

  localStorage.setItem("basicCoverage", JSON.stringify(coverages));
  window.location.href = 'addon-coverage.html';
}
