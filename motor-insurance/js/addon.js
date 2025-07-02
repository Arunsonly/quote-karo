function toggleOptions(id) {
  const element = document.getElementById(id);
  element.classList.toggle('hidden');
}

function goBack() {
  window.location.href = 'coverage-selection.html';
}

function goNext() {
  const data = {
    personalEffects: document.getElementById('personalEffects').checked ? parseInt(document.getElementById('peAmount').value) : 0,
    geoArea: document.getElementById('geoArea').checked,
    towing: document.getElementById('towing').checked ? parseInt(document.getElementById('towAmount').value) : 0,
    tyreRim: document.getElementById('tyreRim').checked,
    emiProtect: document.getElementById('emiProtect').checked,
    emiMonths: document.getElementById('emiProtect').checked ? parseInt(document.getElementById('emiMonths').value) : 0,
    emiAmount: document.getElementById('emiProtect').checked ? parseFloat(document.getElementById('emiAmount').value) || 0 : 0,
    altCar: document.getElementById('altCar').checked,
    altCarDays: document.getElementById('altCar').checked ? parseInt(document.getElementById('altCarDays').value) : 0,
    payAsDrive: document.getElementById('payAsDrive').checked
  };

  localStorage.setItem("addonCoverage", JSON.stringify(data));
  window.location.href = 'liability-discount.html';
}
