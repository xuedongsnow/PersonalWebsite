# xdcreates.com — Snow Xue Dong

Your personal portfolio site. It's plain HTML/CSS/JS with **no build step**, so you can edit everything directly on GitHub's website and it goes live automatically.

## What's in here

```
index.html        →  About page (your home page)
work.html         →  Work page (client projects)
artist.html       →  Artist page (personal art, with filter)
teacher.html      →  Teacher page (simple blog)
assets/
  styles.css      →  all colors, fonts, and layout
  site.js         →  behavior (carousels, filter, video, etc.)
  favicon.svg     →  the little icon in the browser tab
images/           →  drop your photos and artwork here
CNAME             →  your custom domain (xdcreates.com)
.nojekyll         →  tells GitHub to serve the files as-is
```

Each page's words live inside that page's file. To change what a page says, open its `.html` file and edit the text **between** the tags (the parts like `<h3 class="work-title">Bajillions</h3>` — you change `Bajillions`, not the tags).

---

## How to edit (all on GitHub's website)

1. Go to the file you want to change and click the **pencil icon** (Edit).
2. Make your change.
3. Scroll down and click **Commit changes**. Your site updates in a minute or two.

To add images, open the `images` folder and click **Add file → Upload files**.

### Change your bio (About)
Open `index.html` and edit the sentences inside the `about-bio` block.

### Add or edit a project (Work)
Open `work.html`. Each project is one `<article class="work-card"> … </article>` block.
- **To edit:** change the title, client, product list, audience, and link text.
- **To add:** copy an entire block (from `<article` to `</article>`), paste it, and edit it.
- **Carousel images:** each project shows a few images. Inside a project you'll see `<div class="slide ph ph-4x3"><span>Photo 1</span></div>`. Replace `<span>Photo 1</span>` with `<img src="images/your-file.jpg" alt="what it shows">`. Add or remove `slide` blocks to change how many images (and add/remove a matching `<button class="dot">` for each).

### Add art or a video (Artist)
Open `artist.html`. Each item is one `<article class="art-card"> … </article>` block with two settings on it:
- `data-date="2024-11-02"` — the date (newest sorts to the top).
- `data-category="Painting"` — one of `Painting`, `Animation`, or `Photography` (used by the filter).

For a **photo** item, replace `<span>Photo</span>` with your `<img …>`.
For a **YouTube video**, use a block with `class="yt-facade"` and set `data-id` to the video's ID — the part after `youtu.be/`. For `https://youtu.be/XuF981GLDCQ`, the ID is `XuF981GLDCQ`. The video only loads when a visitor clicks it, so nothing plays on its own.

### Add a teaching post (Teacher)
Open `teacher.html`. Each post is one `<article class="post"> … </article>` block. Copy a block to add a new post; newest usually goes at the top. You can add images inside a post the same way (`<img src="images/…" alt="…">`).

### Add an image anywhere
1. Upload the file into the `images` folder.
2. Replace a grey placeholder's inner `<span>…</span>` with `<img src="images/your-file.jpg" alt="short description">`.
Any size works — it's cropped neatly to fill the frame. Always fill in `alt` with a short description (good for accessibility).

### Change colors or fonts
Open `assets/styles.css`. The very top `:root` block holds every color (e.g. `--yellow`, `--green`) and the fonts. Change a value there and it updates everywhere.

---

## Turn on Google Analytics
1. Get your Measurement ID from Google Analytics (it looks like `G-XXXXXXXXXX`).
2. Open `assets/site.js`, find the line near the top: `var GA_MEASUREMENT_ID = '';`
3. Put your ID between the quotes: `var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';`
4. Commit. Analytics now runs on every page. (Leaving it empty keeps it off.)

---

## Publish it on GitHub Pages (with xdcreates.com)

1. Create a repository and upload these files (or the whole folder).
2. In the repo, go to **Settings → Pages**, set the source to your `main` branch, and **Save**. Your site appears at `https://xuedongsnow.github.io/…` within a minute.
3. Your domain is already set via the `CNAME` file. To finish it: in **Settings → Pages → Custom domain**, confirm `xdcreates.com` is shown, then at your domain registrar add these DNS records —
   - Four **A** records for the root `xdcreates.com`, pointing to: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME** record for `www` → `xuedongsnow.github.io`
4. Once it verifies, tick **Enforce HTTPS**. (DNS can take up to a day; HTTPS up to an hour after that.)

---

## Preview it on your computer
Just double-click `index.html` — it opens in your browser and works fully, no setup needed.
