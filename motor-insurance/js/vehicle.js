function checkFuelType() {
  const fuel = document.getElementById('fuelType').value;
  const subFuel = document.getElementById('subFuelOptions');
  subFuel.classList.toggle('hidden', fuel !== 'petrol');
}

function showPolicyForm() {
  const type = document.getElementById('policyType').value;
  const bundleForm = document.getElementById('bundleForm');
  if (type === "bundle") {
    bundleForm.classList.remove('hidden');
  } else {
    bundleForm.classList.add('hidden');
  }
}

function goBack() {
  window.location.href = 'index.html';
}

function goNext() {
  const policyType = document.getElementById('policyType').value;
  if (policyType !== 'bundle') {
    alert("Please select 'Brand New Bundle Policy' to continue.");
    return;
  }

  const exShowroom = parseFloat(document.getElementById('exShowroomCost').value);
  const electricAccessories = parseFloat(document.getElementById('electricAccessories').value) || 0;
  const zone = document.getElementById('zone').value;
  const cc = parseInt(document.getElementById('cubicCapacity').value);
  const fuel = document.getElementById('fuelType').value;
  const invoice = parseFloat(document.getElementById('invoiceValue').value) || 0;
  const passengers = parseInt(document.getElementById('passengers').value) || 0;
  const driver = parseInt(document.getElementById('driver').value) || 1;
  const ev = document.getElementById('ev').checked;
  const cngLpg = document.getElementById('cngLpg').checked;

  if (!exShowroom || !zone || !cc || !fuel) {
    alert("Please fill all mandatory fields marked with *");
    return;
  }

  const vehicleData = {
    exShowroom,
    electricAccessories,
    zone,
    cc,
    fuel,
    invoice,
    passengers,
    driver,
    ev,
    cngLpg
  };

  localStorage.setItem("vehicleData", JSON.stringify(vehicleData));
  window.location.href = 'coverage-selection.html';
}
