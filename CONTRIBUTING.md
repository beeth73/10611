# So, you want to fork this?

**Speaking of forking...** you know what else you should fork? Your attention span to this guide. (Just kidding... mostly).

If you saw this terminal aesthetic and thought, *"I need that level of nerd cred in my life,"* you are welcome to clone this repo and make it your own. But before you deploy, let's do a quick teardown of what you need to change so you don't look like a copy-paste script kiddie.

Here is the **Tech Quickie** guide to customizing this template:

## 1. Quick Start (The "Plug and Play")
1.  **Fork** this repository (Top right corner. Click it. Do it now).
2.  **Clone** it to your machine.
3.  Run it locally (literally just double-click `index.html` or use Live Server).

## 2. The "Search and Destroy" Checklist
Open `index.html` in VS Code (or Vim, if you hate yourself) and look for these sections:

*   **The Header:** Change `~/Bhushan_Ladgaonkar` to your handle. Don't leave my name there. It gets awkward during interviews.
*   **The ASCII Art:** Head over to an ASCII generator (like patorjk.com), type your name, and paste the result inside the `<pre>` tag in the `#loader` div.
*   **The Bio:** Update the text in `~/about`. Tell your story, not mine.
*   **The Links:** Update the `href` links for GitHub, LinkedIn, and Email in the footer.

## 3. The Resume (Paperwork)
1.  Delete `Bhushan_Ladgaonkar_Resume.pdf`.
2.  Upload your own PDF.
3.  Update the link in the `<nav>` section of `index.html` to match your filename. **Pro Tip:** Keep the filename simple so you don't break the link.

## 4. Customizing Colors (RGB all the things?)
You don't need to hunt through 500 lines of CSS. Open `styles.css` and look at the `:root` variables at the very top. It's basically a theme engine.

```css
:root {
    /* Change this to your favorite color. 
       Use Neon Green for that "Mainframe Hacker" vibe, 
       or Hot Pink if you want to be chaotic. */
    --accent-color-light: #00aaff; 
    --accent-color-dark: #00aaff;
}
```

## 5. Analytics (DO NOT SKIP THIS)
**⚠️ CRITICAL WARNING:**
Go to `index.html` and **DELETE** the `<script>` tag for GoatCounter.

If you don't do this, every time someone visits *your* site, it sends the analytics data to *my* dashboard. I mean, I love seeing numbers go up, but I don't need to know how many people are looking at your resume. Set up your own GoatCounter account or just nuke the script.

## Contributing Code
If you find a bug in the CSS, or you figure out a way to make the ASCII art responsive on an 8K monitor without breaking the layout, feel free to open a Pull Request!

**Now, get out there and build something cool.**
