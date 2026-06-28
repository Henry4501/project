// TODO for students:
// This page is your task to implement!
//
// What you need to do:
// 1. Fetch all tags using GET /api/tags
// 2. Display them in a list with a delete button
// 3. Delete a tag using DELETE /api/tags/:id
// 4. Update the UI after deletion (remove the tag from the list)
//
// Hint: Look at how Favorites.jsx fetches data and how LinkCard.jsx handles delete.
// You already have everything you need — apiRequest, useAuth, useReducer.

import Layout from "@/components/Layout";

export default function Tags() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Tags</h1>
      <p className="text-muted-foreground">Your task: implement this page!</p>
    </Layout>
  );
}
