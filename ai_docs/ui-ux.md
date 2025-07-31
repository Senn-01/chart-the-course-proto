# UI/UX Design Document: Chart The Course
**Version:** 1.0
**Date:** July 29, 2025

## 1. Core UI/UX Principles

The user interface will be guided by a set of core principles that reflect the application's purpose as a tool for focus and clarity.

-   **Minimalism & Focus:** The design will be clean, with ample negative space to create a calm, uncluttered environment. We will subtract elements until the core functionality remains.
-   **Thematic Cohesion:** The nautical/exploration theme will be conveyed subtly through a muted color palette, classic typography, and deliberate language—not literal, skeuomorphic graphics.
-   **High-Signal, Low-Noise:** Information will be presented with clarity and purpose. We will avoid vanity metrics, complex charts, and distracting notifications.
-   **Frictionless Input:** The primary actions of capturing ideas and logging reflections must be instantaneous and seamless, with voice and keyboard shortcuts as first-class citizens.
-   **Satisfying Feedback:** Key interactions—completing a session, promoting an idea, extending a streak—will be accompanied by subtle, satisfying micro-interactions (animations, haptics on mobile) to reinforce positive habits.

## 2. Design System

### 2.1. Color Palette
-   **Background:** Off-white (`#F8F5F0`), reminiscent of aged paper or a ship's sail.
-   **Primary Text:** Dark, desaturated blue (`#2E4057`), like fountain pen ink.
-   **Accent/Action Color:** Muted gold/brass (`#C5A06D`), used for buttons, links, and active states.
-   **Muted/Secondary Text:** A soft grey (`#8A94A2`).
-   **Analytics Palette:** A sequential scale of blues for heatmaps and charts.

### 2.2. Typography
-   **Headings (H1, H2, Module Titles):** A classic serif font (e.g., **Lora** or **Playfair Display**) to evoke a literary, "logbook" feel.
-   **Body & UI Text:** A highly readable, clean sans-serif font (e.g., **Inter**).

### 2.3. Iconography
-   Minimalist, lightweight line icons (e.g., **Feather Icons**).

## 3. Global Elements

-   **Navigation:** A fixed, narrow sidebar on the left, containing only icons for the six main modules. On hover, a tooltip reveals the module name (e.g., "The Chart Room"). The current module's icon will be highlighted with the accent color.
-   **Footer:** A small, unobtrusive footer on each page will display the relevant Hemingway quote in a light, italicized font.

## 4. Module-Specific UI/UX

### 4.1. Uncharted Territories
-   **Objective:** To capture an idea with zero friction.
-   **Layout:** A single, prominent text input field is the focus at the top of the page. Below it, a clean, single-column list of `Idea` cards.
-   **Interactions:**
    -   Typing in the input field and pressing `Enter` adds the new `Idea` to the top of the list with a subtle "slide-in" animation. The input field immediately clears for the next idea.
    -   `Idea` cards are plain text. On hover, action buttons ("Promote," "Archive," "Discard") fade in to minimize visual clutter.
    -   Clicking "Promote" opens a small, inline form or a minimal modal to select `Impact` and `Effort` scores (1-5 dots).

### 4.2. True North Compass
-   **Objective:** To create and refine one's personal constitution.
-   **Layout:** A two-panel interface.
    -   **Left Panel (70% width):** Displays the rendered `Vision` document with clean typography.
    -   **Right Panel (30% width):** A standard chat interface for the AI "Co-Pilot."
-   **Interactions:** As the user interacts with the chat AI, the left panel will show a subtle loading state and then update smoothly when the AI provides a revised `Vision` document.

### 4.3. The Chart Room
-   **Objective:** To get a high-level strategic overview of all potential work.
-   **Layout:** A large 2x2 grid representing the Impact/Effort Matrix. Each `Initiative` is a "card" within its respective quadrant. The card displays only the `Initiative` name.
-   **Interactions:**
    -   Hovering over a card subtly enlarges it and fades in action buttons ("Archive," "Mark as Complete").
    -   The view is read-only by design. It is a map for making decisions, not a canvas for rearranging work.

### 4.4. The Daily Expedition
-   **Objective:** To facilitate a state of deep, uninterrupted focus.
-   **Layout (Pre-Session):** An extremely minimal screen with a single, large, centered button with the text "Begin The Daily Expedition."
-   **Layout (During Session):**
    -   Upon clicking the button and selecting an `Initiative`, the UI fades to an almost blank screen.
    -   **Center:** A large, clear countdown timer (e.g., `90:00`). Above it, in a smaller font, is the name of the current `Initiative`.
    -   **Bottom:** The user's one-sentence mission statement is visible but faint.
    -   There are no other navigation or UI elements. Pressing `ESC` will fade in a confirmation dialog to prevent accidental session termination.
-   **Interactions:** Upon completion, the screen shows a simple "Expedition Complete" message and an encouraging animation before returning the user to the dashboard.

### 4.5. Captain's Log
-   **Objective:** To make daily reflection an easy and insightful habit.
-   **Layout:** A reverse-chronological timeline. Each day is a section with a clear date heading. The day's summary (`WorkSessions`, `Milestones`) is listed, followed by the structured log entry.
-   **Interactions:**
    -   The "Record Today's Log" button, when clicked, opens a modal.
    -   The modal displays a large microphone icon and a subtle waveform visualization to show it's listening. A single "Stop Recording" button is present.
    -   After stopping, a loading indicator shows the AI is processing. The modal then closes and the new, formatted log entry appears in the timeline.

### 4.6. Reading the Wake
-   **Objective:** To visualize consistency and strategic alignment at a glance.
-   **Layout:** A clean, spacious dashboard.
    -   **Main Component:** A large calendar heatmap of the past year, showing the intensity of `WorkSessions` per day.
    -   **Side Components:** Two small "stat cards" for the current "Work Session Streak" and "Reflection Streak." A simple donut or bar chart showing "Effort Allocation by Initiative (Last 30 Days)."
-   **Interactions:** Hovering over any element (a day on the heatmap, a segment on the chart) provides a tooltip with precise data (e.g., "July 29, 2025: 3 Work Sessions," "Initiative 'X': 8 Sessions").