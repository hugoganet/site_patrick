# Project media data (JSON)

This folder contains the project manifest and one JSON file per project. The JSON drives the gallery and points to Gumlet-hosted media.

## Files

- `projects.json`: ordered list of projects to render.
- `<slug>.json`: data for a single project (title, year, description, credits, medias).

## JSON schema (per project)

```json
{
  "title": "Project Title (as shown in menu)",
  "slug": "url-friendly-slug",
  "year": "2024",
  "description": "Short tagline or description",
  "credits": [
    { "role": "Role name", "names": ["Person A", "Person B"] }
  ],
  "medias": [
    { "type": "image", "src": "https://warans.gumlet.io/path/to/image.webp", "alt": "Accessible alt" },
    { "type": "video", "id": "<GUMLET_EMBED_ID>", "ratio": "16/9" }
  ],
  "showInfo": true
}
```

Notes:

- You can set `ratio` (e.g. `"281/100"`) to enforce a specific iframe aspect ratio.
- To migrate, copy the correct Gumlet links/IDs from `tmp_gumlet_media_extraction.html` into these JSONs.
- Ordering in `projects.json` dictates display order and navigation behavior.
