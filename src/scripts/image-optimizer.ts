import { createStoredZip, downloadBlob, MAX_BATCH_BYTES, MAX_IMAGE_COUNT, optimizeImageBatch, ObjectUrlPool, validateImageFile, type ImageFormat, type OptimizedImage, type ResizeOptions, type ZipEntry } from '../lib/image-optimizer';

const root = document.querySelector<HTMLElement>('#image-optimizer');
if (root) {
  type Copy = Record<string, string>;
  interface Item { id: number; file: File; sourceURL: string; outputURL?: string; output?: OptimizedImage; error?: string; card: HTMLElement }
  const copy = JSON.parse(root.dataset.copy ?? '{}') as Copy;
  const locale = root.dataset.locale === 'uk' ? 'uk-UA' : 'en-US';
  const fileInput = root.querySelector<HTMLInputElement>('#image-files')!;
  const cards = root.querySelector<HTMLElement>('[data-image-cards]')!;
  const dropZone = root.querySelector<HTMLElement>('[data-drop-zone]')!;
  const processButton = root.querySelector<HTMLButtonElement>('[data-process]')!;
  const zipButton = root.querySelector<HTMLButtonElement>('[data-zip]')!;
  const clearButton = root.querySelector<HTMLButtonElement>('[data-clear]')!;
  const errorBox = root.querySelector<HTMLElement>('[data-error]')!;
  const progress = root.querySelector<HTMLElement>('[data-progress]')!;
  const quality = root.querySelector<HTMLInputElement>('#image-quality')!;
  const format = root.querySelector<HTMLSelectElement>('#image-format')!;
  const qualityValue = root.querySelector<HTMLOutputElement>('[data-quality-value]')!;
  const qualityField = root.querySelector<HTMLElement>('[data-quality-field]')!;
  const backgroundField = root.querySelector<HTMLElement>('[data-background-field]')!;
  const summary = root.querySelector<HTMLElement>('[data-batch-summary]')!;
  const items: Item[] = [];
  const urls = new ObjectUrlPool(blob => URL.createObjectURL(blob), url => URL.revokeObjectURL(url));
  let sequence = 0;
  let busy = false;

  const formatBytes = (bytes: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(bytes / 1024) + ' KiB';
  const percent = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  const t = (key: string, values: Record<string, string | number> = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), copy[key] ?? key);
  const runtime = {
    decode: (file: Blob) => createImageBitmap(file),
    createCanvas: (width: number, height: number) => {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      return canvas;
    },
  };
  const setError = (key: string) => { errorBox.textContent = t(key); errorBox.hidden = false; };
  const updateButtons = () => {
    processButton.disabled = busy || items.length === 0;
    clearButton.disabled = busy || items.length === 0;
    zipButton.disabled = busy || !items.some(item => item.output);
  };
  const revokeOutput = (item: Item) => { urls.release(item.outputURL); item.outputURL = undefined; item.output = undefined; };
  const renderCard = (item: Item) => {
    const card = document.createElement('article'); card.className = 'image-result-card';
    const heading = document.createElement('div'); heading.className = 'image-result-heading';
    const title = document.createElement('h3'); title.textContent = item.file.name;
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'button secondary small'; remove.textContent = t('remove'); remove.setAttribute('aria-label', `${t('remove')}: ${item.file.name}`);
    remove.addEventListener('click', () => removeItem(item.id)); heading.append(title, remove);
    const previews = document.createElement('div'); previews.className = 'image-preview-pair';
    const before = document.createElement('figure'); const original = document.createElement('img'); original.src = item.sourceURL; original.alt = `${t('before')}: ${item.file.name}`; original.loading = 'lazy'; original.decoding = 'async';
    const beforeCaption = document.createElement('figcaption'); beforeCaption.textContent = `${t('before')} · ${formatBytes(item.file.size)}`; before.append(original, beforeCaption);
    const after = document.createElement('figure'); after.dataset.after = '';
    const afterCaption = document.createElement('figcaption'); afterCaption.textContent = t('not-processed'); after.append(afterCaption); previews.append(before, after);
    const details = document.createElement('p'); details.className = 'image-result-details'; details.dataset.details = '';
    const warning = document.createElement('p'); warning.className = 'notice image-larger-warning'; warning.dataset.warning = ''; warning.textContent = t('larger'); warning.hidden = true;
    const actions = document.createElement('div'); actions.className = 'actions'; actions.dataset.actions = '';
    card.append(heading, previews, details, warning, actions); item.card = card; cards.append(card);
  };
  const renderOutput = (item: Item) => {
    const after = item.card.querySelector<HTMLElement>('[data-after]')!;
    after.replaceChildren();
    const img = document.createElement('img'); img.src = item.outputURL!; img.alt = `${t('after')}: ${item.file.name}`; img.loading = 'lazy'; img.decoding = 'async';
    const caption = document.createElement('figcaption'); caption.textContent = `${t('after')} · ${item.output!.width} × ${item.output!.height} px · ${formatBytes(item.output!.blob.size)}`;
    after.append(img, caption);
    const details = item.card.querySelector<HTMLElement>('[data-details]')!;
    details.textContent = `${t('format')}: ${item.output!.blob.type.replace('image/', '').toUpperCase()} · ${t('saved')}: ${percent(item.output!.savedPercent)}`;
    item.card.querySelector<HTMLElement>('[data-warning]')!.hidden = item.output!.blob.size <= item.file.size;
    const actions = item.card.querySelector<HTMLElement>('[data-actions]')!; actions.replaceChildren();
    const download = document.createElement('a'); download.className = 'button secondary small'; download.href = item.outputURL!; download.download = item.output!.name; download.textContent = t('download'); actions.append(download);
  };
  const updateSummary = () => {
    const done = items.filter(item => item.output);
    summary.hidden = done.length === 0;
    if (!done.length) return;
    const original = done.reduce((sum, item) => sum + item.file.size, 0);
    const output = done.reduce((sum, item) => sum + item.output!.blob.size, 0);
    root.querySelector<HTMLElement>('[data-total-input]')!.textContent = formatBytes(original);
    root.querySelector<HTMLElement>('[data-total-output]')!.textContent = formatBytes(output);
    root.querySelector<HTMLElement>('[data-total-saved]')!.textContent = `${formatBytes(original - output)} (${percent((original - output) / original * 100)})`;
  };
  const invalidateOutputs = () => {
    for (const item of items) {
      revokeOutput(item);
      const after = item.card.querySelector<HTMLElement>('[data-after]')!; after.replaceChildren();
      const caption = document.createElement('figcaption'); caption.textContent = t('not-processed'); after.append(caption);
      item.card.querySelector<HTMLElement>('[data-details]')!.textContent = '';
      item.card.querySelector<HTMLElement>('[data-warning]')!.hidden = true;
      item.card.querySelector<HTMLElement>('[data-actions]')!.replaceChildren();
    }
    updateSummary(); updateButtons();
    if (items.length) progress.textContent = t('needs-processing');
  };
  const removeItem = (id: number) => {
    const index = items.findIndex(item => item.id === id); if (index < 0) return;
    const [item] = items.splice(index, 1); revokeOutput(item); urls.release(item.sourceURL); item.card.remove(); updateSummary(); updateButtons();
    if (!items.length) progress.textContent = t('empty');
  };
  const clearAll = () => {
    for (const item of items) { revokeOutput(item); urls.release(item.sourceURL); }
    items.length = 0; cards.replaceChildren(); summary.hidden = true; fileInput.value = ''; errorBox.hidden = true; progress.textContent = t('empty'); updateButtons();
  };
  const addFiles = (fileList: FileList | File[]) => {
    errorBox.hidden = true;
    const accepted: File[] = []; const remaining = MAX_IMAGE_COUNT - items.length;
    for (const file of Array.from(fileList)) {
      if (items.length + accepted.length >= MAX_IMAGE_COUNT) { setError('count'); break; }
      const invalid = validateImageFile(file);
      if (invalid) { setError(invalid === 'type' ? 'fileType' : invalid); continue; }
      const currentBytes = items.reduce((sum, item) => sum + item.file.size, 0) + accepted.reduce((sum, item) => sum + item.size, 0);
      if (currentBytes + file.size > MAX_BATCH_BYTES) { setError('batch-size'); continue; }
      accepted.push(file);
    }
    if (!remaining && fileList.length) setError('count');
    for (const file of accepted) {
      const item = { id: ++sequence, file, sourceURL: urls.createURL(file), card: document.createElement('article') } as Item;
      items.push(item); renderCard(item);
    }
    if (accepted.length) { invalidateOutputs(); progress.textContent = `${items.length} / ${MAX_IMAGE_COUNT}`; }
    updateButtons(); fileInput.value = '';
  };
  const getDimensions = () => {
    const widthInput = root.querySelector<HTMLInputElement>('#image-width')!;
    const heightInput = root.querySelector<HTMLInputElement>('#image-height')!;
    const desiredWidth = widthInput.value === '' ? 0 : Number(widthInput.value);
    const desiredHeight = heightInput.value === '' ? 0 : Number(heightInput.value);
    if (![desiredWidth, desiredHeight].every(Number.isInteger) || (widthInput.value !== '' && desiredWidth < 1) || (heightInput.value !== '' && desiredHeight < 1) || desiredWidth > 10000 || desiredHeight > 10000) throw new RangeError('dimensions');
    return { width: desiredWidth, height: desiredHeight, preserveAspectRatio: root.querySelector<HTMLInputElement>('#image-ratio')!.checked };
  };
  const processAll = async () => {
    if (busy || !items.length) return;
    const selectedFormat = format.value as ImageFormat;
    const qualityNumber = Number(quality.value) / 100;
    let dimensions: ResizeOptions;
    try { dimensions = getDimensions(); }
    catch { setError('dimensions'); return; }
    if (dimensions.width === 0 && dimensions.height === 0) { setError('noDimensions'); return; }
    busy = true; errorBox.hidden = true; invalidateOutputs(); processButton.disabled = true; zipButton.disabled = true; clearButton.disabled = true;
    try {
      const background = root.querySelector<HTMLInputElement>('#image-background')!.value;
      const batch = [...items];
      const results = await optimizeImageBatch(batch.map(item => ({ file:item.file, options:{ ...dimensions, format:selectedFormat, quality:qualityNumber, background } })), runtime, async (current,total) => {
        progress.textContent = t('processing', { current, total });
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      });
      results.forEach((result,index) => {
        const item=batch[index]; if (!items.includes(item)) return; item.error=result.error; item.output=result.output;
        if(result.output){item.outputURL=urls.createURL(result.output.blob);renderOutput(item);}
        else if(result.error){item.card.querySelector<HTMLElement>('[data-details]')!.textContent=t(result.error);if(result.error==='output-limit')setError('output-limit');}
      });
    } finally {
      busy = false; updateSummary(); updateButtons();
      progress.textContent = items.length ? t('complete', { count: items.filter(item => item.output).length }) : t('empty');
    }
  };
  const downloadZip = async () => {
    const done = items.filter(item => item.output);
    if (!done.length) return;
    zipButton.disabled = true;
    try {
      const entries: ZipEntry[] = done.map((item, index) => ({ name: `${String(index + 1).padStart(2, '0')}_${item.output!.name}`, blob: item.output!.blob }));
      const archive = await createStoredZip(entries); downloadBlob(archive, 'demandlab-optimized-images.zip',{createObjectURL:blob=>URL.createObjectURL(blob),revokeObjectURL:url=>URL.revokeObjectURL(url),trigger:(url,name)=>{const anchor=document.createElement('a');anchor.href=url;anchor.download=name;anchor.hidden=true;document.body.append(anchor);anchor.click();anchor.remove();},defer:(callback,delay)=>{window.setTimeout(callback,delay);}}); progress.textContent = t('downloadZipReady');
    } catch (cause) { setError(cause instanceof RangeError ? cause.message : 'zip'); }
    finally { updateButtons(); }
  };
  fileInput.addEventListener('change', () => { if (fileInput.files) addFiles(fileInput.files); });
  root.querySelector<HTMLButtonElement>('[data-process]')!.addEventListener('click', () => { void processAll(); });
  root.querySelector<HTMLButtonElement>('[data-clear]')!.addEventListener('click', clearAll);
  root.querySelector<HTMLButtonElement>('[data-zip]')!.addEventListener('click', () => { void downloadZip(); });
  root.querySelector<HTMLInputElement>('#image-quality')!.addEventListener('input', () => { qualityValue.value = `${quality.value}%`; });
  format.addEventListener('change', () => { qualityField.hidden = format.value === 'png'; backgroundField.hidden = format.value !== 'jpeg'; invalidateOutputs(); });
  root.querySelectorAll<HTMLInputElement>('#image-width,#image-height,#image-ratio,#image-quality,#image-background').forEach(input => input.addEventListener('change', invalidateOutputs));
  dropZone.addEventListener('dragover', event => { event.preventDefault(); dropZone.classList.add('drag-active'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-active'));
  dropZone.addEventListener('drop', event => { event.preventDefault(); dropZone.classList.remove('drag-active'); const transfer = (event as DragEvent).dataTransfer; if (transfer?.files) addFiles(transfer.files); });
  window.addEventListener('pagehide', () => { urls.clear(); });
  updateButtons();
}
