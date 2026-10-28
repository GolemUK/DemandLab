import { calculatePricing, calculateTargetPrice, formatMoney, type Currency, type PricingInput, type PricingMode } from '../lib/profit-calculator';

const root = document.querySelector<HTMLElement>('#profit-calculator');
if (root) {
  const locale = root.dataset.locale === 'uk' ? 'uk-UA' : 'en-US';
  const copy = JSON.parse(root.dataset.copy ?? '{}') as Record<string, string>;
  const fields = [...root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-field]')];
  const outputs = Object.fromEntries([...root.querySelectorAll<HTMLElement>('[data-output]')].map(el => [el.dataset.output!, el]));
  const error = root.querySelector<HTMLElement>('[data-error]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const results = [...root.querySelectorAll<HTMLElement>('[data-results]')];
  const scenarios = root.querySelector<HTMLTableSectionElement>('[data-scenarios]')!;
  const chart = root.querySelector<HTMLElement>('[data-chart]')!;
  let mode: PricingMode = 'known-price';
  let latest = '';

  const readInput = (): PricingInput => {
    const values = Object.fromEntries(fields.filter((el): el is HTMLInputElement => el instanceof HTMLInputElement).map(el => {
      const key = el.dataset.field!;
      return [key, el.value.trim() === '' && !['unitCost', 'salePrice', 'targetMargin', 'quantity'].includes(key) ? 0 : el.valueAsNumber];
    })) as unknown as PricingInput;
    return { ...values, salePrice: values.salePrice, quantity: values.quantity, targetMargin: values.targetMargin };
  };
  const currency = (): Currency => (root.querySelector<HTMLSelectElement>('[data-field="currency"]')!.value as Currency);
  const money = (value: number) => formatMoney(value, currency(), locale);
  const setOutput = (key: string, value: string) => { if (outputs[key]) outputs[key].textContent = value; };
  const showError = (key: string) => {
    error.textContent = copy[key] ?? copy.invalid;
    error.hidden = false;
    results.forEach(el => { el.hidden = true; });
    empty.hidden = true;
  };
  const drawChart = (result: ReturnType<typeof calculatePricing>) => {
    const parts = [result.unitCosts + result.fixedFee, result.percentageFee, result.tax, result.profitPerUnit];
    const denom = parts.reduce((sum, value) => sum + Math.abs(value), 0) || 1;
    const labels = ['cost', 'fees', 'tax', 'profit'];
    chart.replaceChildren(...parts.map((amount, i) => {
      const segment = document.createElement('span');
      segment.className = `price-chart-segment ${labels[i]}${amount < 0 ? ' negative' : ''}`;
      segment.style.width = `${Math.max(amount === 0 ? 0 : 1, Math.abs(amount) / denom * 100)}%`;
      segment.title = `${labels[i]}: ${money(amount)}`;
      return segment;
    }));
    chart.setAttribute('aria-label', `${copy.estimate}: ${parts.map((amount, i) => `${labels[i]} ${money(amount)}`).join(', ')}`);
  };
  const renderScenarios = (input: PricingInput) => {
    const targets = [...new Set([10, 20, 30, 40, ...(mode === 'target-margin' ? [input.targetMargin] : [])])].sort((a, b) => a - b);
    scenarios.replaceChildren(...targets.map(target => {
      const row = document.createElement('tr');
      try {
        const scenario = calculateTargetPrice(input, target);
        for (const value of [`${target}%`, money(scenario.price), money(scenario.profitPerUnit), scenario.markup === null ? copy.notAvailable : `${scenario.markup.toFixed(1)}%`]) {
          const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
        }
      } catch {
        const cells = [`${target}%`, copy.unreachable, copy.notAvailable, copy.notAvailable];
        for (const value of cells) { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }
      }
      return row;
    }));
  };
  const calculate = () => {
    error.hidden = true; status.textContent = '';
    const input = readInput();
    try {
      const result = calculatePricing(input, mode);
      setOutput('price', money(result.price));
      setOutput('profitPerUnit', money(result.profitPerUnit));
      setOutput('margin', `${result.margin.toFixed(2)}%`);
      setOutput('markup', result.markup === null ? copy.notAvailable : `${result.markup.toFixed(2)}%`);
      setOutput('periodProfit', money(result.periodProfit));
      setOutput('breakEven', result.breakEvenUnits === null ? copy.noBreakEven : `${result.breakEvenUnits} ${copy.unit}`);
      setOutput('costs', money(result.unitCosts + result.fixedFee));
      setOutput('fees', money(result.percentageFee));
      setOutput('tax', money(result.tax));
      drawChart(result); renderScenarios(input);
      results.forEach(el => { el.hidden = false; }); empty.hidden = true;
      const loss = result.periodProfit < 0;
      outputs.periodProfit?.classList.toggle('negative-result', loss);
      latest = [
        `${copy.recommendedPrice}: ${money(result.price)}`,
        `${copy.profitPerUnit}: ${money(result.profitPerUnit)}`,
        `${copy.margin}: ${result.margin.toFixed(2)}%`,
        `${copy.markup}: ${result.markup === null ? copy.notAvailable : `${result.markup.toFixed(2)}%`}`,
        `${copy.periodProfit}: ${money(result.periodProfit)}`,
      ].join('\n');
    } catch (cause) {
      const key = cause instanceof RangeError ? cause.message : 'invalid';
      showError(key); latest = '';
    }
  };
  root.addEventListener('input', calculate);
  root.addEventListener('change', calculate);
  root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode as PricingMode;
    root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(other => {
      const active = other === button; other.setAttribute('aria-pressed', String(active));
      other.classList.toggle('secondary', !active);
    });
    root.querySelectorAll<HTMLElement>('[data-known-field]').forEach(el => { (el as HTMLElement).hidden = mode !== 'known-price'; });
    root.querySelectorAll<HTMLElement>('[data-target-field]').forEach(el => { (el as HTMLElement).hidden = mode !== 'target-margin'; });
    calculate();
  }));
  root.querySelector<HTMLButtonElement>('[data-reset]')!.addEventListener('click', () => {
    root.querySelectorAll<HTMLInputElement>('input[data-field]').forEach(input => { input.value = input.dataset.field === 'targetMargin' ? '25' : input.dataset.field === 'quantity' ? '10' : '0'; });
    root.querySelector<HTMLSelectElement>('[data-field="currency"]')!.value = 'UAH';
    mode = 'known-price';
    root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(btn => { const active = btn.dataset.mode === mode; btn.setAttribute('aria-pressed', String(active)); btn.classList.toggle('secondary', !active); });
    root.querySelectorAll<HTMLElement>('[data-known-field]').forEach(el => { el.hidden = false; });
    root.querySelectorAll<HTMLElement>('[data-target-field]').forEach(el => { el.hidden = true; });
    calculate();
  });
  root.querySelector<HTMLButtonElement>('[data-copy]')!.addEventListener('click', async () => {
    if (!latest) return;
    try { await navigator.clipboard.writeText(latest); status.textContent = copy.copyDone; }
    catch { status.textContent = copy.copyFail; }
  });
  calculate();
}
