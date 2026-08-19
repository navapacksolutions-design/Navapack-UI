# NavaPack Apps Script backend

1. Create a Google Sheet, then open **Extensions → Apps Script** from it.
2. Copy `Code.gs` and `appsscript.json` into that project.
3. In **Project Settings → Script properties**, add `SPREADSHEET_ID` with the Sheet ID (the part after `/d/` in its URL).
4. Run `initializeBackend` once from the Apps Script editor to create the spreadsheet tabs. Add an admin row to `Users` with `email`, `name`, `passwordHash`, `active`. Generate the password hash by running `hash_('your-password')` in the editor and paste its return value; use `true` for active.
5. Deploy → **New deployment** → Web app. Execute as **Me** and allow access appropriate to your site. Copy the `/exec` URL.
6. Create `.env.local` from `.env.example` and set `VITE_APPS_SCRIPT_URL="your /exec URL"`. Restart Vite.

The script creates sheets for products, quotes, enquiries and subscribers automatically. The React product-admin screen appears under the user icon in the navbar after login.

> Apps Script web apps use Google redirect URLs. If your deployment does not return CORS headers to a separately hosted Vite site, host the compiled frontend in Apps Script's HTML Service or place a small CORS-capable proxy (Cloudflare Worker/Firebase) in front of this endpoint. The server functions themselves remain unchanged.
