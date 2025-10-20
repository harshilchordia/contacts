# 🔐 Encrypted Contacts Viewer

A secure, password-protected contacts viewer with encrypted CSV storage for GitHub Pages.

## 🌟 Features

- **Password Protected**: SHA-256 password hashing
- **AES-256-GCM Encryption**: Military-grade encryption for contacts file
- **Client-Side Only**: No server needed, runs entirely in browser
- **Searchable**: Filter contacts by name, email, phone, organization, or notes
- **Multiple Contact Info**: Displays all phone numbers and emails per contact

## 🚀 Setup

### 1. Encrypt Your Contacts File

First, encrypt your `contacts.csv` file:

```bash
node encrypt-csv.js
```

You'll be prompted for a password. This creates `contacts.csv.enc` (encrypted file).

### 2. Set Your Password Hash

Open the page in a browser, open DevTools Console (F12), and run:

```javascript
await generatePasswordHash('YourPasswordHere')
```

Copy the hash and update `PASSWORD_HASH` in `index.html` (around line 39).

### 3. Deploy

Commit and push to GitHub:

```bash
git add .
git commit -m "Add encrypted contacts"
git push origin main
```

Your site will be live at `https://yourusername.github.io`

## 📝 Updating Contacts

When you need to update contacts:

1. Edit `contacts.csv` (locally, never commit this!)
2. Re-encrypt: `node encrypt-csv.js`
3. Commit the new `contacts.csv.enc`:
   ```bash
   git add contacts.csv.enc
   git commit -m "Update contacts"
   git push
   ```

## 🔒 Security

- **Password Hash**: Only SHA-256 hash stored in code, password never visible
- **CSV Encryption**: AES-256-GCM with PBKDF2 (100,000 iterations)
- **Safe for Public Repos**: Encrypted file can be safely committed
- **Session-Only**: Password stored in memory only during session

## 📁 Files

- `index.html` - Main application
- `styles.css` - Styling
- `contacts.csv` - **NEVER COMMIT** (in .gitignore)
- `contacts.csv.enc` - Encrypted version (safe to commit)
- `encrypt-csv.js` - Encryption utility script
- `.gitignore` - Ensures contacts.csv is never committed

## 🛠️ Local Development

Run a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

## ⚠️ Important Notes

- Use the **same password** for encrypting CSV and viewing in browser
- Keep `contacts.csv` local and **never commit** it
- Only commit `contacts.csv.enc`
- If you forget your password, you'll need to re-encrypt with a new one

## 🔄 Switching Between Plain/Encrypted CSV

In `index.html`, update the `CSV_FILE` constant:

```javascript
// For encrypted (recommended for public repos)
const CSV_FILE = 'contacts.csv.enc';

// For plain text (only for private repos)
const CSV_FILE = 'contacts.csv';
```

The code automatically detects if the file is encrypted based on the `.enc` extension.

## 📱 CSV Format

Expected format is Google Contacts export CSV with columns:
- First Name, Middle Name, Last Name
- E-mail 1-4 - Value
- Phone 1-4 - Value
- Organization Name
- Notes

## 🤝 Contributing

Feel free to open issues or submit PRs!

## 📄 License

MIT License - feel free to use for your own projects!
