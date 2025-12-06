# Build Instructions - Windows Only

This application is configured to build for **Windows only** (x64 architecture).

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Windows 10/11** (for testing and building)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Verify installation:**
   ```bash
   npm start
   ```
   This will launch the development version of the app.

## Building for Windows

### Option 1: Build Installer + Portable (Recommended)

```bash
npm run make:win
```

This will create:
- **Squirrel Installer** (`.exe`) - Windows installer with auto-update support
- **Portable ZIP** - Standalone portable version

Output location: `out/make/`

### Option 2: Package Only (No Installer)

```bash
npm run package
```

This creates a packaged version without an installer.

Output location: `out/hint-ai-win32-x64/`

## Build Output

After running `npm run make:win`, you'll find:

```
out/
├── make/
│   ├── squirrel.windows/
│   │   └── x64/
│   │       ├── Hint AI-0.4.0 Setup.exe  ← Install this
│   │       └── RELEASES
│   └── zip/
│       └── win32/
│           └── x64/
│               └── hint-ai-win32-x64-0.4.0.zip  ← Portable version
```

### Installer Details

The **Squirrel installer** (`Hint AI-0.4.0 Setup.exe`) will:
- Install to `%LocalAppData%\hint-ai`
- Create desktop shortcut
- Create Start Menu shortcut
- Support automatic updates (when configured)

### Portable Version

The **ZIP file** contains a portable version:
- Extract anywhere
- Run `hint-ai.exe`
- No installation required
- Settings stored in `%AppData%\hint-ai`

## Distribution

To distribute your build:

1. **For End Users:**
   - Distribute `Hint AI-0.4.0 Setup.exe` (installer)
   - Or distribute the ZIP file (portable)

2. **File Locations:**
   - Installer: `out/make/squirrel.windows/x64/`
   - Portable: `out/make/zip/win32/x64/`

## Troubleshooting

### Build Fails

If the build fails, try:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run make:win
```

### Missing Dependencies

Ensure you have all dev dependencies:

```bash
npm install --save-dev @electron-forge/maker-squirrel @electron-forge/maker-zip
```

### Icon Not Showing

- Ensure `src/assets/logo.ico` exists
- The icon must be a valid `.ico` file with multiple sizes (16x16, 32x32, 48x48, 256x256)

## Version Management

To update the version before building:

1. Edit `package.json`:
   ```json
   "version": "0.4.0"
   ```

2. Rebuild:
   ```bash
   npm run make:win
   ```

## Clean Build

To clean previous builds:

```bash
# Remove build artifacts
rm -rf out/

# Full clean rebuild
rm -rf out/ node_modules/
npm install
npm run make:win
```

## Build Configuration

Build settings are in `forge.config.js`:

- **Platform:** Windows only (`win32`)
- **Architecture:** x64 (64-bit)
- **Makers:** Squirrel (installer) + ZIP (portable)
- **Icon:** `src/assets/logo.ico`

## Notes

- Build time: ~2-5 minutes (depending on your system)
- Output size: ~150-200 MB (includes Electron runtime)
- Requires ~500 MB free disk space for build process
- No code signing by default (Windows will show "Unknown Publisher" warning)

## Code Signing (Optional)

To remove the "Unknown Publisher" warning:

1. Obtain a code signing certificate
2. Update `forge.config.js` with certificate details
3. Rebuild with signing enabled

See [Electron Forge documentation](https://www.electronforge.io/guides/code-signing) for details.


