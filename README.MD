# Vision2Markup

Vision2Markup is an AI-powered web application generator that converts **design images** or **custom block-based designs** into fully functional HTML/CSS/JS web apps. The goal is to let anyone quickly turn visual ideas into a working web interface without manually coding.

---

## Features

- **Image to HTML**: Upload a design image and AI generates the corresponding HTML layout.
- **Design Builder**: Use drag-and-drop blocks (headers, text, buttons) to design your web page interactively.
- **Live Preview**: See the generated web page instantly in your browser.
- **Download ZIP**: Export your generated web app as a ZIP containing HTML, CSS, JS, and instructions.
- **Caching**: Preview results are cached to reduce repeated AI calls and improve performance.

---

## ZIP Contents

When you download a generated web app, the ZIP contains:

- `index.html` – the main HTML file.
- `style.css` – default styling for the web app.
- `script.js` – default JavaScript for basic interactivity.
- `README.md` – instructions for using and deploying your web app.

---

## How to Use

### 1. Upload Mode

1. Click **Upload Image**.
2. Select a design image (JPEG, PNG).
3. Click **Generate Web App**.
4. Preview appears instantly; download the ZIP for full files.

### 2. Design Builder Mode

1. Click **Design Builder**.
2. Add blocks using the toolbar (Header, Text, Button).
3. Edit the content of each block in the editor.
4. Click **Generate Web App**.
5. Preview and download as ZIP.

---

## How to Deploy

1. Extract the downloaded ZIP file.
2. Open `index.html` in a browser to preview.
3. Host the folder on any static web server (e.g., GitHub Pages, Netlify, Vercel) to deploy online.

---

## Notes & Tips

- You can customize `style.css` to change the look and feel of your web app.
- You can extend `script.js` for interactivity or add more JS libraries.
- Generated HTML is AI-created; small tweaks may be needed for complex designs.
- Preview and ZIP are generated using AI to reduce manual coding effort.

---

## Tech Stack

- **Backend**: Java Spring Boot
- **AI Service**: LLM for image/design-to-HTML conversion
- **Frontend**: React + TailwindCSS
- **Caching**: Spring Cache with Caffeine for fast previews
- **ZIP Generation**: Java NIO + ZipOutputStream

---

## Vision

Vision2Markup aims to **bridge design and development** by allowing designers, product managers, and non-technical users to convert ideas directly into code, drastically reducing the time from concept to prototype.

---

## License

MIT License – free to use, modify, and distribute.

---
