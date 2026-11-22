# Healthify — beyond calories

An interactive prototype of the **Food Insight** flows: give context beyond the
calorie, explain what it means, and help people take a better next step — with AI,
without making chat a mandatory step.

Vanilla HTML / CSS / JS. No build, no dependencies.

```bash
python3 -m http.server 4179 --directory beyond-calories
```

Then open <http://localhost:4179>. Sibling prototype: `../ria-prototype` (the
chat-first redesign) runs on 4178.

---

## The three core flows

The left sidebar states these for a first-time viewer. They are the three jobs the
five screens in the board do, not six separate features.

**01 · Notice it while logging.** The food log flags the entries worth a second
look, right underneath them — *Calories aren't the full picture*. Nothing to ask
for; it is already sitting in the log. One nudge per meal, never one per item,
so the log still reads like a log.

**02 · Understand the food.** Food Insight: what this food actually is, the two or
three things worth knowing, and why each one matters. Each flag opens a sheet with
the explanation and what to do about it.

**03 · Do something about it.** Healthier picks that swap into the log in one tap,
recipes to cook instead, or Ria in plain words. The swap is real — the log, the
meal total and the day total all move, and the nudge disappears with the food that
earned it.

Underneath all three: **Ria stays quiet when there is nothing to say.** Open the
melon under Morning Snack and the insight card reads *Nothing to flag here*. That
restraint is the point of the pattern; without it the nudge becomes wallpaper.

---

## What is live

| Screen | What works |
| --- | --- |
| **Food log** | Day and meal totals computed from the entries. Nudge opens the food. `⋮` → Food Insight / Edit quantity / Remove (with Undo). Planned items are excluded from Cal Eaten. |
| **Food detail** | Quantity and Measure are live selects — macros, the calorie line and the **Save Changes** state all recompute. Saving writes back to the log. |
| **Food Insight** | Three flags, each with its own sheet. Healthier picks ↔ Recipes. Adding a pick swaps it into the log; recipes open a sheet with method. |
| **Detail sheets** | Flag sheet (what it is → why it matters → what you can do → *See better options*). Recipe sheet (why it is better, time, calories, three steps). |
| **Ria chat** | Carries the food as context. Two contextual starters plus a keyword responder: regularity, options, recipes, sodium, sugar, fat, portion, macros, how it fits the day. Picks are addable from inside the thread. |

The seeded log holds one flagged food, **Lays Chilli Chips**, and one unflagged
one, the melon. A second full insight set — the **Ice Cream Sandwich**, with its
own flags, picks and recipes — is still in `FOODS` / `INSIGHT`; adding an entry
with `food: 'ice'` to `freshState()` puts it back in the log.

Controls that are honestly out of scope (the day picker, Insights, Snap, Save as
Meal, the recipe library, voice) say so when tapped rather than doing nothing.

---

## Things to know before this goes in front of anyone

**The macro figures come from the uploaded board and are not real.** 30 g of chilli
chips is shown as 121 Cal with 6.5 g protein and 2.7 g fat. Real crisps are nearer
160 Cal with ~10 g fat and ~2 g protein. As it stands the screen flags *Contains
saturated fat* next to a 2.7 g fat reading, which contradicts itself. The numbers
were kept as-is so the prototype matches the board — replace them from the real
nutrition database before this is shown as a working product.

**Everything on screen now uses real photography**, supplied for this
prototype and sitting in `assets/`:

| File | Used by |
| --- | --- |
| `lays.webp` | Lays Chilli Chips |
| `melon.webp` | Melon, Water |
| `too-yumm.webp` | pick: Too Yumm! Baked Chips |
| `makhana.jpg` | pick and recipe: Roasted Makhana |
| `multigrain.jpg` | pick: Multigrain Chips |
| `corn-chaat.jpg` | recipe: Masala Corn Chaat |
| `potato-wedges.webp` | recipe: Air-fried Potato Wedges |

Add art to anything with `img: { src, fit }` — `fit: 'contain'` for a packshot
on white, `fit: 'cover'` for a full-bleed food photo. If a file is missing the
drawn glyph comes back instead of a broken image. The drawn tiles remain as the
fallback and for the ice cream set.

**Two labels do not match their packets.** The pick called *Too Yumm! Baked
Chips* shows a Too Yumm! **Multigrain Chips (Dahi Papdi Chaat)** pack, and the
pick called *Multigrain Chips* shows a **Neelam Roasted Multi Grain Chips**
pack — so two of the three picks read as multigrain, and the first name does
not describe the product in its photo. Either rename the picks to the packs, or
swap the photos.

**The brand packaging is the client's to clear.** Lays, Too Yumm! and Neelam
artwork is in here because it was supplied for the prototype, not because this
deck has rights to it.

**Ria's opening line in chat is contextual, the board's is generic.** The board
reuses the global "I can plan your day, suggest meals and keep your food log
straight" even though the screen arrives with a specific food attached. Here she
opens on that food instead, which is what the two starters below her already
assume.

---

## Structure

```
index.html   device shell, the guide sidebar host, the right-hand chrome
styles.css   tokens, device, screens, sheets, sidebar / note pane
app.js       data (FOODS, INSIGHT), state, screens, sheets, chat, guide
```

`app.js` follows the same architecture as the chat prototype next door: one `st`
object, one `render()`, event delegation on `[data-act]` into an `ACTIONS` map.
Sheets render into a separate `#overlay` so opening one does not rebuild the
screen underneath.
