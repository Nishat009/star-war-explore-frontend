🧪 QA & Test Plan – Star Wars Explorer
This QA/Test Plan ensures the Star Wars Explorer application meets functional, performance, and user experience standards, with a focus on SWAPI integration, custom enhancements (species, homeworld, films), pagination, search, caching, and UX consistency.

🎯 Objectives
Verify correct display of enriched character data

Ensure pagination and search work as intended

Validate loading indicators and error handling

Guarantee responsive and intuitive user experience, even under failure or edge scenarios

📋 Test Cases
🧪 TC001 – Initial Data Load
Precondition: Backend server running, frontend opened in a browser.

Steps:

Load the homepage without entering a search term.

Wait for the data to load.

Expected Result:

10 characters displayed on page 1.

Each card shows:

Name, height, mass, homeworld, species, and films.

Missing data fields display Unknown.

Pass Criteria:

No console errors.

Fields rendered correctly, including “Unknown” placeholders.

Loading placeholders visible before content appears.

🧪 TC002 – Pagination Navigation
Precondition: More than 10 characters available.

Steps:

On page 1, click Next.

Verify page 2 data loads.

Click Previous to return to page 1.

Expected Result:

Smooth navigation between pages.

Correct character sets displayed for each page.

Pass Criteria:

“Previous” button is disabled on page 1.

“Next” button is disabled on the last page.

No URL change (clean URL requirement).

🧪 TC003 – Search by Name (Client-side)
Precondition: At least 2 pages of data cached locally.

Steps:

Enter Luke in the search input.

Wait for filtering to complete.

Expected Result:

Case-insensitive match (e.g., “luke” also works).

Filters only from already fetched/cached pages.

Results update in real-time.

Pass Criteria:

Matches are displayed correctly.

No duplicates.

Correct pagination for filtered data.

🧪 TC004 – Error Handling (SWAPI Failure)
Precondition: Simulate SWAPI failure (e.g., stop the backend or force 500).

Steps:

Refresh the homepage or trigger a search during the failure.

Expected Result:

Shows fallback character cards with partial data.

“Unknown” for missing data.

User-friendly error message shown.

Pass Criteria:

No frontend crash.

Error clearly logged in console.

Fallback data and error UI appear gracefully.

🧪 TC005 – Custom Data Enhancement (Species and Films)
Precondition: A character with missing species or multiple films exists.

Steps:

Navigate to a page with such a character.

Inspect species and films fields.

Expected Result:

Species displayed correctly (or “Unknown”).

Films list populated from resolved URLs.

Pass Criteria:

Species: Correct or “Unknown”.

Films: Titles listed without blanks.

🧪 TC006 – Performance with Cached Data
Precondition: Browse at least 3 pages to build local cache.

Steps:

Type a broad keyword (e.g., “a”) in search.

Switch between cached pages.

Expected Result:

Search operates instantly without additional backend calls.

Cached results appear immediately.

Pass Criteria:

Search < 1 second.

No visible lag or freezes.

🧪 TC007 – Loading State and Placeholder Behavior
Precondition: Trigger a data fetch by changing page or clearing search.

Steps:

Click “Next” or enter a search term.

Observe UI during loading.

Expected Result:

Old results are cleared.

Skeleton loaders or “Loading…” appear.

No stale/unfiltered data flashes.

Pass Criteria:

Loading placeholders remain visible until results are ready.

🧪 TC008 – “No Characters Found” Message Timing
Issue Fixed: Previously shown before loading completed.

Steps:

Slowly type a valid search term (e.g., “lu”).

Watch the results.

Expected Result:

“No characters found” appears only after:

Loading is complete

And there are 0 matching results

Pass Criteria:

Message does not appear during loading.

Appears only when loading === false AND results are empty.

🧪 TC009 – Clean URL Behavior
Steps:

Navigate across pages.

Enter a search term.

Expected Result:

The browser URL remains unchanged.

Search and pagination states are internal to React.

Pass Criteria:

No query params like ?page=2 or ?search=luke.

🧪 TC010 – Data Consistency After Page Change
Steps:

Move to page 2.

Return to page 1.

Expected Result:

Page 1 shows correct data without re-fetch delay (uses cache).

Pass Criteria:

Page changes back instantly using cached data.
