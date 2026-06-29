// Student task. Build this page to exercise the full CRUD set against the tags
// routes you implement in the backend (src/routes/tags.js): GET, POST, PUT, DELETE.
//
// What to build:
//   1. READ   - on load, fetch all tags with GET /api/tags and show them in a list.
//               (See how Favorites.jsx fetches data inside useEffect.)
//   2. CREATE - an input + button that POSTs /api/tags with { name }, then adds
//               the returned tag to the list.
//               (See how CollectionForm.jsx submits a POST.)
//   3. UPDATE - a rename action that PUTs /api/tags/:id with the new { name },
//               then replaces that tag in the list.
//   4. DELETE - a delete button that calls DELETE /api/tags/:id, then removes
//               the tag from the list.
//               (See how LinkCard.jsx handles delete.)
//
// State: manage the list and the input with useReducer, the same way the other
// pages do (look at Links.jsx for the reducer pattern: SET_DATA / ADD / UPDATE /
// DELETE actions, each returning a new array immutably).
//
// You already have everything you need: apiRequest, useAuth's getToken, useReducer.
// Remember each request needs the token: const token = await getToken().
//
// Patterns to copy:
//   - Fetch in useEffect:      src/pages/Favorites.jsx
//   - useReducer list updates: src/pages/Links.jsx
//   - POST a new record:       src/components/CollectionForm.jsx
//   - DELETE a record:         src/components/LinkCard.jsx

import Layout from "@/components/Layout";

export default function Tags() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Tags</h1>
      <p className="text-muted-foreground">
        Your task: implement full CRUD here (GET, POST, PUT, DELETE).
      </p>
    </Layout>
  );
}
