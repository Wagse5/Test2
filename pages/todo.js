import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { analyzeOverallSentiment } from '../lib/sentimentAnalysis';
import Layout from '../components/Layout';
import SentimentChart from '../components/SentimentChart';
import Tabs from '../components/Tabs';

const buttonStyle = {
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  fontSize: '0.9rem',
  transition: 'background-color 0.3s'
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  marginRight: '1rem',
  borderRadius: '20px',
  border: '1px solid #ccc'
};

const noteItemStyle = {
  marginBottom: '1rem',
  padding: '1rem',
  border: '1px solid #ddd',
  borderRadius: '10px',
  backgroundColor: '#f9f9f9',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'box-shadow 0.3s'
};

const getSentimentEmoji = (sentiment) => {
  switch (sentiment) {
    case 'Positive':
    case 'Overall Positive':
      return '😊';
    case 'Negative':
    case 'Overall Negative':
      return '😔';
    default:
      return '😐';
  }
};

export default function Todo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');
  const [overallSentiment, setOverallSentiment] = useState('');
  const [activeTab, setActiveTab] = useState('Present Sentiment');

  useEffect(() => {
    if (session) {
      fetchNotes();
    }
  }, [session]);

  async function fetchNotes() {
    console.log('Fetching notes...');
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      console.log('Fetch response:', JSON.stringify(data));
      if (res.ok) {
        setNotes(data);
        updateOverallSentiment(data.filter(note => !note.isDone));
      } else {
        console.error('Failed to fetch notes:', data.error);
        setError('Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Error fetching notes');
    }
  }

  async function addNote(e) {
    e.preventDefault();
    setError('');
    console.log('Adding note...');
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });
      const data = await res.json();
      console.log('Add note response:', JSON.stringify(data));
      if (res.ok) {
        setNewNote('');
        fetchNotes();
      } else {
        console.error('Failed to add note:', data.error);
        setError(data.error || 'Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Error adding note');
    }
  }

  async function toggleNoteDone(id, currentStatus) {
    setError('');
    console.log('Toggling note status...');
    try {
      const res = await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isDone: !currentStatus }),
      });
      const data = await res.json();
      console.log('Toggle note response:', JSON.stringify(data));
      if (res.ok) {
        fetchNotes();
      } else {
        console.error('Failed to toggle note:', data.error);
        setError(data.error || 'Failed to toggle note');
      }
    } catch (error) {
      console.error('Error toggling note:', error);
      setError('Error toggling note');
    }
  }

  function updateOverallSentiment(activeNotes) {
    const sentiment = analyzeOverallSentiment(activeNotes);
    setOverallSentiment(sentiment);
  }

  const activeNotes = notes.filter(note => !note.isDone);
  const archivedNotes = notes.filter(note => note.isDone);

  const renderPresentSentiment = () => (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#e9ecef', 
      borderRadius: '10px',
      textAlign: 'center'
    }}>
      <h3 style={{ color: '#4a4a4a', marginBottom: '1rem' }}>Your Current Mood</h3>
      <p style={{ 
        fontWeight: 'bold', 
        fontSize: '5rem'
      }}>
        {getSentimentEmoji(overallSentiment)}
      </p>
      <p style={{ fontSize: '1.2rem', color: '#4a4a4a' }}>
        {overallSentiment || 'Not enough data to determine your mood'}
      </p>
    </div>
  );

  const renderActiveNotes = () => (
    <div>
      <h3 style={{ color: '#4a4a4a', marginBottom: '1rem' }}>Active Notes</h3>
      <form onSubmit={addNote} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter a new note"
          required
          style={inputStyle}
        />
        <button type="submit" style={{...buttonStyle, marginTop: '0.5rem', width: '100%'}}>Add Note</button>
      </form>
      {activeNotes.length === 0 ? (
        <p>No active notes. Add your first note!</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
          {activeNotes.map((note) => (
            <li key={note._id} style={{...noteItemStyle, ':hover': { boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}}>
              <div>
                <strong>{note.content}</strong>
                <br />
                <span style={{ fontSize: '1.5rem' }}>
                  {getSentimentEmoji(note.sentiment)}
                </span>
              </div>
              <button 
                onClick={() => toggleNoteDone(note._id, note.isDone)}
                style={{...buttonStyle, backgroundColor: '#2196F3'}}
              >
                Archive
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderSentimentGraph = () => (
    <div>
      <h3 style={{ color: '#4a4a4a', marginBottom: '1rem' }}>How You've Been</h3>
      <SentimentChart notes={notes} />
    </div>
  );

  const renderArchivedNotes = () => (
    <div>
      <h3 style={{ color: '#4a4a4a', marginBottom: '1rem' }}>Archived Notes</h3>
      {archivedNotes.length === 0 ? (
        <p>No archived notes.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
          {archivedNotes.map((note) => (
            <li key={note._id} style={{...noteItemStyle, backgroundColor: '#e9ecef', ':hover': { boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}}>
              <div>
                <strong style={{ textDecoration: 'line-through' }}>{note.content}</strong>
                <br />
                <span style={{ fontSize: '1.5rem' }}>
                  {getSentimentEmoji(note.sentiment)}
                </span>
              </div>
              <button 
                onClick={() => toggleNoteDone(note._id, note.isDone)}
                style={{...buttonStyle, backgroundColor: '#9E9E9E'}}
              >
                Unarchive
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'Present Sentiment':
        return renderPresentSentiment();
      case 'Active Notes':
        return renderActiveNotes();
      case 'How You\'ve Been':
        return renderSentimentGraph();
      case 'Archived Notes':
        return renderArchivedNotes();
      default:
        return null;
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <Layout>
      <Tabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tabs={['Present Sentiment', 'Active Notes', 'How You\'ve Been', 'Archived Notes']} 
      />
      {renderActiveTab()}
    </Layout>
  );
}

