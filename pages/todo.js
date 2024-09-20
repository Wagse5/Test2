import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Todo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (session) {
      fetchNotes();
    }
  }, [session]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  async function fetchNotes() {
    const res = await fetch('/api/notes');
    const data = await res.json();
    if (res.ok) {
      setNotes(data);
    } else {
      console.error('Failed to fetch notes');
    }
  }

  async function addNote(e) {
    e.preventDefault();
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newNote }),
    });
    if (res.ok) {
      setNewNote('');
      fetchNotes();
    } else {
      console.error('Failed to add note');
    }
  }

  return (
    <div>
      <h1>Todo Page</h1>
      <p>Welcome, {session.user.name || session.user.email}</p>
      
      <form onSubmit={addNote}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter a new note"
          required
        />
        <button type="submit">Add Note</button>
      </form>

      <h2>Your Notes:</h2>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
}
