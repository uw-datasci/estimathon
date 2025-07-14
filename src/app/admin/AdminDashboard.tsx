"use client"

import { useState, useEffect } from 'react';
import { PlusCircle, Users, Clock, Settings, Eye, EyeOff, Edit2, Trash2, Save, X } from 'lucide-react';
import { Question, Team, Event } from '@/lib/supabase';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');

  const [newQuestion, setNewQuestion] = useState({ text: '', answer: '' });
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editQuestionData, setEditQuestionData] = useState({ text: '', answer: '' });

  const [editingEvent, setEditingEvent] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    start_time: '',
    end_time: ''
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchQuestions(),
        fetchTeams(),
        fetchCurrentEvent()
      ]);
    } catch (err) {
      setError('Failed to load data: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    const response = await fetch('/api/questions/admin');
    if (response.ok) {
      const data = await response.json();
      setQuestions(data);
    }
  };

  const fetchTeams = async () => {
    const response = await fetch('/api/teams');
    if (response.ok) {
      const data = await response.json();
      setTeams(data);
    }
  };

  const fetchCurrentEvent = async () => {
    const response = await fetch('/api/events');
    if (response.ok) {
      const data = await response.json();
      setCurrentEvent(data);
      setEventData({
        name: data.name,
        start_time: data.start_time?.slice(0, 16) || '',
        end_time: data.end_time?.slice(0, 16) || ''
      });
    }
  };

  const addQuestion = async () => {
    if (!newQuestion.text || !newQuestion.answer) return;

    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: newQuestion.text,
        answer: parseFloat(newQuestion.answer)
      })
    });

    if (response.ok) {
      setNewQuestion({ text: '', answer: '' });
      fetchQuestions();
    }
  };

  const toggleQuestionRelease = async (questionId: string, released: boolean) => {
    const response = await fetch(`/api/questions/${questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ released: !released })
    });

    if (response.ok) {
      fetchQuestions();
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    const response = await fetch(`/api/questions/${questionId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      fetchQuestions();
    }
  };

  const saveQuestionEdit = async (questionId: string) => {
    const response = await fetch(`/api/questions/${questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: editQuestionData.text,
        answer: parseFloat(editQuestionData.answer)
      })
    });

    if (response.ok) {
      setEditingQuestion(null);
      fetchQuestions();
    }
  };

  const saveEventEdit = async () => {
    const response = await fetch('/api/events', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });

    if (response.ok) {
      setEditingEvent(false);
      fetchCurrentEvent();
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getEventStatus = () => {
    if (!currentEvent) return 'No Event';
    const now = new Date();
    const start = new Date(currentEvent.start_time);
    const end = new Date(currentEvent.end_time);
    
    if (now < start) return 'Upcoming';
    if (now > end) return 'Ended';
    return 'Live';
  };

  const getTimeRemaining = () => {
    if (!currentEvent) return '00:00:00';
    const now = new Date();
    const end = new Date(currentEvent.end_time);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return '00:00:00';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <h2 className="text-2xl font-bold">Admin Access</h2>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          className="p-3 rounded-lg bg-portage-950 border border-portage-800 focus:outline-none"
          placeholder="Enter admin password"
        />
        <button
          onClick={() => {
            if (inputPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
              setUnlocked(true);
            } else {
              alert("Incorrect password");
            }
          }}
          className="px-4 py-2 bg-portage-600 hover:bg-portage-700 rounded-lg font-semibold"
        >
          Unlock
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-900 p-4 shadow-lg sticky top-0 z-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

          <div>
            <header className="">
              <img src="/dsc_white.svg" alt="UW DSC logo" className="h-16 w-auto" />
            </header>
          </div>
          <div className="text-right">
            <div className="text-sm text-portage-400">Event Status</div>
            <div className={`text-lg font-semibold ${
              getEventStatus() === 'Live' ? 'text-green-400' : 
              getEventStatus() === 'Upcoming' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {getEventStatus()}
            </div>
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(o => !o)}
          >
            ☰
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-900 md:min-h-screen p-4">
          <div
            className={`
              ${sidebarOpen ? "block" : "hidden"}
              md:block
              w-full md:w-64
              bg-slate-900
              md:min-h-screen
              p-4
            `}
          >
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('questions')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'questions' ? 'bg-portage-600 text-white' : 'text-portage-300 hover:bg-portage-900'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Questions</span>
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'teams' ? 'bg-portage-600 text-white' : 'text-portage-300 hover:bg-portage-900'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Teams</span>
              </button>
              <button
                onClick={() => setActiveTab('event')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'event' ? 'bg-portage-600 text-white' : 'text-portage-300 hover:bg-portage-900'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>Event Control</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className="text-3xl font-bold">Questions Management</h2>
                <div className="text-portage-400">
                  {questions.filter(q => q.released).length} / {questions.length} Released
                </div>
              </div>

              {/* Add Question Form */}
              <div className="bg-portage-950 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Add New Question</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Question Text</label>
                    <textarea
                      value={newQuestion.text}
                      onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                      className="w-full p-3 bg-portage-900 rounded-lg border border-portage-800 focus:border-portage-500 focus:outline-none"
                      rows={3}
                      placeholder="Enter your question..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Answer (Number)</label>
                    <input
                      type="number"
                      value={newQuestion.answer}
                      onChange={(e) => setNewQuestion({...newQuestion, answer: e.target.value})}
                      className="w-full p-3 bg-portage-900 rounded-lg border border-portage-800 focus:border-portage-500 focus:outline-none"
                      placeholder="Enter the correct answer..."
                    />
                  </div>
                  <button
                    onClick={addQuestion}
                    className="bg-portage-600 hover:bg-portage-700 px-6 py-3 rounded-lg font-semibold transition flex items-center space-x-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Add Question</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="bg-portage-950 p-6 rounded-lg">
                    {editingQuestion === question.id ? (
                      <div className="space-y-4">
                        <textarea
                          value={editQuestionData.text}
                          onChange={(e) => setEditQuestionData({...editQuestionData, text: e.target.value})}
                          className="w-full p-3 bg-portage-900 rounded-lg border border-portage-800 focus:border-portage-500 focus:outline-none"
                          rows={3}
                        />
                        <input
                          type="number"
                          value={editQuestionData.answer}
                          onChange={(e) => setEditQuestionData({...editQuestionData, answer: e.target.value})}
                          className="w-full p-3 bg-portage-900 rounded-lg border border-portage-800 focus:border-portage-500 focus:outline-none"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveQuestionEdit(question.id)}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingQuestion(null)}
                            className="bg-portage-800 hover:bg-portage-900 px-4 py-2 rounded-lg flex items-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <p className="text-lg mb-2">{question.text}</p>
                            <p className="text-portage-400">Answer: {question.answer}</p>
                            <p className="text-sm text-portage-800">Created: {formatDateTime(question.created_at)}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            question.released ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                          }`}>
                            {question.released ? 'Released' : 'Draft'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleQuestionRelease(question.id, question.released)}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                              question.released 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {question.released ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span>{question.released ? 'Hide' : 'Release'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingQuestion(question.id);
                              setEditQuestionData({ text: question.text, answer: question.answer.toString() });
                            }}
                            className="bg-portage-600 hover:bg-portage-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className="text-3xl font-bold">Teams Overview</h2>
                <div className="text-portage-400">
                  {teams.length} Teams Registered
                </div>
              </div>

              <div className="grid gap-4">
                {teams.map((team, index) => (
                  <div key={team.id} className="bg-portage-950 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">Team {team.code}</h3>
                        <p className="text-portage-400">Score: {team.score}</p>
                      </div>
                      <div className="text-2xl font-bold text-portage-400">
                        #{index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Members:</h4>
                      <div className="space-y-1">
                        {team.members?.map((member, i) => (
                          <div key={i} className="text-portage-300">
                            {member.name} ({member.email})
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-portage-900">
                      <p className="text-sm text-portage-400">
                        Submissions: {team.submissions?.length || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'event' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Event Control</h2>

              <div className="bg-portage-950 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-portage-400 mb-2">
                      {getTimeRemaining()}
                    </div>
                    <div className="text-portage-400">Time Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${
                      getEventStatus() === 'Live' ? 'text-green-400' : 
                      getEventStatus() === 'Upcoming' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {getEventStatus()}
                    </div>
                    <div className="text-portage-400">Current Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-portage-400 mb-2">
                      {teams.length}
                    </div>
                    <div className="text-portage-400">Active Teams</div>
                  </div>
                </div>
              </div>

              {currentEvent && (
                <div className="bg-portage-950 p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <h3 className="text-xl font-semibold">Event Details</h3>
                    <button
                      onClick={() => setEditingEvent(!editingEvent)}
                      className="bg-portage-600 hover:bg-portage-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>{editingEvent ? 'Cancel' : 'Edit Event'}</span>
                    </button>
                  </div>

                  {editingEvent ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Event Name</label>
                        <input
                          type="text"
                          value={eventData.name}
                          onChange={(e) => setEventData({...eventData, name: e.target.value})}
                          className="w-full p-3 bg-portage-900 rounded-lg border border-portage-800 focus:border-portage-500 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Start Time</label>
                          <input
                            type="datetime-local"
                            value={eventData.start_time}
                            onChange={(e) => setEventData({...eventData, start_time: e.target.value})}
                            className="w-full p-3 bg-portage-900 rounded-lg border border-portage-800 focus:border-portage-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">End Time</label>
                          <input
                            type="datetime-local"
                            value={eventData.end_time}
                            onChange={(e) => setEventData({...eventData, end_time: e.target.value})}
                            className="w-full p-3 bg-portage-900 rounded-lg border border-portage-800 focus:border-portage-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <button
                        onClick={saveEventEdit}
                        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-portage-300">Event Name</h4>
                        <p className="text-lg">{currentEvent.name}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-portage-300">Start Time</h4>
                          <p className="text-lg">{formatDateTime(currentEvent.start_time)}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-portage-300">End Time</h4>
                          <p className="text-lg">{formatDateTime(currentEvent.end_time)}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-portage-300">Submission Limit</h4>
                        <p className="text-lg">{currentEvent.submission_limit} per team</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}