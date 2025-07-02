function toggleOptions(id) {
  const el = document.getElementById(id);
  el.classList.toggle('hidden');
}

function goBack() {
  window.location.href = 'addon-coverage.html';
}

function calculatePremium() {
  const liability = {
    paOwner: document.getElementById('paOwner').checked,
    paDuration: document.getElementById('paOwner').checked ? parseInt(document.getElementById('paDuration').value) : 0,
    llEmployee: document.getElementById('llEmployee').checked,
    empCount: document.getElementById('llEmployee').checked ? parseInt(document.getElementById('empCount').value) : 0,
    llDriver: document.getElementById('llDriver').checked,
    paPassenger: document.getElementById('paPassenger').checked,
    geoTp: true,
    cngTp: true
  };

  const discount = {
    uwDiscount: Math.min(parseFloat(document.getElementById('uwDiscount').value) || 0, 85),
    zeroDepDiscount: Math.min(parseFloat(document.getElementById('zeroDepDiscount').value) || 0, 40),
    antiTheft: document.getElementById('antiTheft').checked
  };

  localStorage.setItem("liabilityCoverage", JSON.stringify(liability));
  localStorage.setItem("discounts", JSON.stringify(discount));

  window.location.href = 'premium-result.html';
}
