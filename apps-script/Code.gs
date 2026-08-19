/**
 * NavaPack Google Apps Script API.
 * Set SPREADSHEET_ID, ADMIN_EMAIL and ADMIN_PASSWORD_HASH in Script Properties,
 * then deploy this project as a Web app (execute as you; access: Anyone).
 */
const SHEETS = {
  USERS: ['Users', ['email', 'name', 'passwordHash', 'active']],
  PRODUCTS: ['Products', ['id', 'name', 'category', 'categorySlug', 'description', 'tag', 'imageUrl', 'active', 'updatedAt']],
  QUOTES: ['Quote Requests', ['createdAt', 'fullName', 'company', 'email', 'phone', 'productInterest', 'estimatedVolume', 'message']],
  INQUIRIES: ['Inquiries', ['createdAt', 'fullName', 'company', 'email', 'inquiryType', 'message']],
  SUBSCRIBERS: ['Subscribers', ['createdAt', 'email']],
};

function doGet(e) { return handle_(e.parameter || {}); }
/** Run once after setting SPREADSHEET_ID to create every required tab. */
function initializeBackend() { Object.keys(SHEETS).forEach(key => sheet_(SHEETS[key])); }
function doPost(e) {
  try { return handle_(JSON.parse(e.postData.contents || '{}')); }
  catch (error) { return output_({ ok: false, message: 'Invalid JSON request.' }); }
}

function handle_(request) {
  try {
    const action = String(request.action || '');
    let data;
    if (action === 'login') data = login_(request);
    else if (action === 'getProducts') data = getProducts_();
    else if (action === 'saveProduct') { requireAdmin_(request.token); data = saveProduct_(request.product); }
    else if (action === 'submitQuote') data = submitQuote_(request.quote);
    else if (action === 'submitInquiry') data = submitInquiry_(request.inquiry);
    else if (action === 'subscribe') data = subscribe_(request.email);
    else throw new Error('Unknown action.');
    return output_({ ok: true, data: data });
  } catch (error) { return output_({ ok: false, message: error.message || 'Request failed.' }); }
}

function output_(payload) { return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON); }
function sheet_(entry) {
  const ss = SpreadsheetApp.openById(properties_().SPREADSHEET_ID);
  let sheet = ss.getSheetByName(entry[0]);
  if (!sheet) { sheet = ss.insertSheet(entry[0]); sheet.appendRow(entry[1]); sheet.setFrozenRows(1); }
  return sheet;
}
function properties_() { return PropertiesService.getScriptProperties().getProperties(); }
function text_(value) { return String(value == null ? '' : value).trim(); }
function hash_(value) { const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8); return bytes.map(b => ('0' + (b & 255).toString(16)).slice(-2)).join(''); }
function rows_(entry) { const values = sheet_(entry).getDataRange().getValues(); const headers = values.shift(); return values.filter(r => r.some(v => v !== '')).map(row => headers.reduce((o, h, i) => (o[h] = row[i], o), {})); }
function append_(entry, record) { const headers = entry[1]; sheet_(entry).appendRow(headers.map(key => record[key] == null ? '' : record[key])); }

function login_(request) {
  const email = text_(request.email).toLowerCase(); const password = String(request.password || '');
  if (!email || !password) throw new Error('Email and password are required.');
  const user = rows_(SHEETS.USERS).find(row => text_(row.email).toLowerCase() === email && String(row.active).toLowerCase() !== 'false');
  if (!user || text_(user.passwordHash) !== hash_(password)) throw new Error('Invalid email or password.');
  const token = Utilities.getUuid(); CacheService.getScriptCache().put('session:' + token, JSON.stringify({ email: email, name: text_(user.name) }), 21600);
  return { token: token, user: { email: email, name: text_(user.name) } };
}
function requireAdmin_(token) { const session = CacheService.getScriptCache().get('session:' + text_(token)); if (!session) throw new Error('Your session has expired. Please sign in again.'); return JSON.parse(session); }
function getProducts_() { return rows_(SHEETS.PRODUCTS).filter(p => String(p.active).toLowerCase() !== 'false').map(p => ({ ...p, active: String(p.active).toLowerCase() !== 'false' })); }
function saveProduct_(product) {
  if (!product || !text_(product.id) || !text_(product.name)) throw new Error('Product ID and name are required.');
  const sheet = sheet_(SHEETS.PRODUCTS); const headers = SHEETS.PRODUCTS[1]; const records = rows_(SHEETS.PRODUCTS); const record = { ...product, active: product.active !== false, updatedAt: new Date().toISOString() };
  const index = records.findIndex(p => text_(p.id) === text_(record.id)); const values = headers.map(key => record[key] == null ? '' : record[key]);
  if (index >= 0) sheet.getRange(index + 2, 1, 1, headers.length).setValues([values]); else sheet.appendRow(values);
  return record;
}
function submitQuote_(quote) { if (!quote || !text_(quote.fullName) || !text_(quote.email)) throw new Error('Name and email are required.'); append_(SHEETS.QUOTES, { ...quote, createdAt: new Date().toISOString() }); }
function submitInquiry_(inquiry) { if (!inquiry || !text_(inquiry.fullName) || !text_(inquiry.email) || !text_(inquiry.message)) throw new Error('Name, email and message are required.'); append_(SHEETS.INQUIRIES, { ...inquiry, createdAt: new Date().toISOString() }); }
function subscribe_(email) { email = text_(email).toLowerCase(); if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('A valid email is required.'); if (!rows_(SHEETS.SUBSCRIBERS).some(r => text_(r.email).toLowerCase() === email)) append_(SHEETS.SUBSCRIBERS, { createdAt: new Date().toISOString(), email: email }); }
