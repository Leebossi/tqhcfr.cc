const cadenceSteps = [60, 70, 80, 90, 100, 110, 120];

const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : '—';

const gcd = (a, b) => {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
};

const renderSpokes = (count = 20) => {
  const group = document.querySelector('#skidSpokes');
  if (!group) {
    return;
  }

  group.innerHTML = '';

  const center = 100;
  const radiusInner = 5;
  const radiusOuter = 76;
  const angleStep = (Math.PI * 2) / count;

  for (let i = 0; i < count; i += 1) {
    const angle = i * angleStep + Math.PI / 2;
    const x1 = center + Math.cos(angle) * radiusInner;
    const y1 = center + Math.sin(angle) * radiusInner;
    const x2 = center + Math.cos(angle) * radiusOuter;
    const y2 = center + Math.sin(angle) * radiusOuter;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toFixed(2));
    line.setAttribute('y1', y1.toFixed(2));
    line.setAttribute('x2', x2.toFixed(2));
    line.setAttribute('y2', y2.toFixed(2));
    line.setAttribute('class', 'skid-spoke');
    group.appendChild(line);
  }
};

const renderSkidPatches = (count, alternate = false) => {
  const group = document.querySelector('#skidPatches');
  if (!group) {
    return;
  }

  group.innerHTML = '';

  if (!Number.isFinite(count) || count <= 0) {
    return;
  }

  const center = 100;
  const radiusInner = 70;
  const radiusOuter = 86;
  const angleStep = (Math.PI * 2) / count;

  for (let i = 0; i < count; i += 1) {
    const angle = i * angleStep + Math.PI / 2;
    const x1 = center + Math.cos(angle) * radiusInner;
    const y1 = center + Math.sin(angle) * radiusInner;
    const x2 = center + Math.cos(angle) * radiusOuter;
    const y2 = center + Math.sin(angle) * radiusOuter;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toFixed(2));
    line.setAttribute('y1', y1.toFixed(2));
    line.setAttribute('x2', x2.toFixed(2));
    line.setAttribute('y2', y2.toFixed(2));
    const patchClass = alternate
      ? `skid-patch skid-patch--${i % 2 === 0 ? 'left' : 'right'}`
      : 'skid-patch';
    line.setAttribute('class', patchClass);
    group.appendChild(line);
  }
};

const getInputs = () => {
  const wheelDiameter = Number(document.querySelector('#wheelDiameter')?.value);
  const tireSize = Number(document.querySelector('#tireSize')?.value);
  const crankLength = Number(document.querySelector('#crankLength')?.value);
  const frontTeeth = Number(document.querySelector('#frontTeeth')?.value);
  const rearTeeth = Number(document.querySelector('#rearTeeth')?.value);

  return { wheelDiameter, tireSize, crankLength, frontTeeth, rearTeeth };
};

const updateResults = () => {
  const { wheelDiameter, tireSize, crankLength, frontTeeth, rearTeeth } = getInputs();

  const gearInchesEl = document.querySelector('#gearInches');
  const meterDevEl = document.querySelector('#meterDev');
  const gainRatioEl = document.querySelector('#gainRatio');
  const cadenceTableEl = document.querySelector('#cadenceTable');
  const skidCountEl = document.querySelector('#skidCount');
  const skidAmbiToggle = document.querySelector('#skidAmbi');

  if (!gearInchesEl || !meterDevEl || !gainRatioEl || !cadenceTableEl || !skidCountEl) {
    return;
  }

  const valid = [wheelDiameter, tireSize, crankLength, frontTeeth, rearTeeth].every(
    (value) => Number.isFinite(value) && value > 0
  );

  if (!valid) {
    gearInchesEl.textContent = '—';
    meterDevEl.textContent = '—';
    gainRatioEl.textContent = '—';
    skidCountEl.textContent = '—';
    cadenceTableEl.innerHTML = '';
    renderSkidPatches(0);
    return;
  }

  const effectiveWheelDiameter = wheelDiameter + tireSize * 2;
  const gearRatio = frontTeeth / rearTeeth;
  const wheelDiameterMeters = effectiveWheelDiameter / 1000;
  const wheelDiameterInches = effectiveWheelDiameter / 25.4;
  const wheelRadiusMm = effectiveWheelDiameter / 2;

  const gearInches = wheelDiameterInches * gearRatio;
  const meterDevelopment = Math.PI * wheelDiameterMeters * gearRatio;
  const gainRatio = (wheelRadiusMm / crankLength) * gearRatio;
  const baseSkidPatches = Math.round(rearTeeth / gcd(frontTeeth, rearTeeth));
  const isAmbidextrous = skidAmbiToggle?.checked && frontTeeth % 2 === 0;
  const skidPatches = Math.min(
    isAmbidextrous ? baseSkidPatches * 2 : baseSkidPatches,
    rearTeeth
  );

  gearInchesEl.textContent = `${formatNumber(gearInches, 1)} in`;
  meterDevEl.textContent = `${formatNumber(meterDevelopment, 2)} m`;
  gainRatioEl.textContent = formatNumber(gainRatio, 2);
  skidCountEl.textContent = skidPatches.toString();
  renderSkidPatches(skidPatches, isAmbidextrous);

  cadenceTableEl.innerHTML = cadenceSteps
    .map((cadence) => {
      const speedMps = meterDevelopment * cadence / 60;
      const speedKph = speedMps * 3.6;
      // const speedMph = speedKph * 0.621371;

      return `
        <tr>
          <td>${cadence}</td>
          <td>${formatNumber(speedKph, 1)}</td>
        </tr>
      `;
    })
    .join('');
};

document.addEventListener('input', (event) => {
  const target = event.target;
  if (
    (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) &&
    target.closest('.calculator')
  ) {
    updateResults();
  }
});

const closeAllSelects = () => {
  document.querySelectorAll('.custom-select__menu.is-open').forEach((menu) => {
    menu.classList.remove('is-open');
  });
  document.querySelectorAll('.custom-select__trigger[aria-expanded="true"]').forEach((trigger) => {
    trigger.setAttribute('aria-expanded', 'false');
  });
};

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const trigger = target.closest('.custom-select__trigger');
  const option = target.closest('.custom-select__option');

  if (trigger) {
    const wrapper = trigger.closest('.custom-select');
    const menu = wrapper?.querySelector('.custom-select__menu');

    if (!menu) {
      return;
    }

    const isOpen = menu.classList.contains('is-open');
    closeAllSelects();
    if (!isOpen) {
      menu.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    return;
  }

  if (option) {
    const wrapper = option.closest('.custom-select');
    const value = option.getAttribute('data-value');
    const input = wrapper?.querySelector('input[type="hidden"]');
    const valueEl = wrapper?.querySelector('.custom-select__value');
    const triggerEl = wrapper?.querySelector('.custom-select__trigger');

    if (value && input && valueEl && triggerEl) {
      input.value = value;
      valueEl.textContent = value;
      triggerEl.setAttribute('aria-expanded', 'false');
      const menu = wrapper?.querySelector('.custom-select__menu');
      menu?.classList.remove('is-open');
      updateResults();
    }
    return;
  }

  if (!target.closest('.custom-select')) {
    closeAllSelects();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeAllSelects();
  }
});

document.addEventListener('DOMContentLoaded', updateResults);
document.addEventListener('DOMContentLoaded', () => renderSpokes(20));