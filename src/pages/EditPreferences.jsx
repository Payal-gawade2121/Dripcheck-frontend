import { useState, useEffect } from 'react';
import Chips from '../components/Chips';
import Button from '../components/Button';
import { fetchPreferences, updatePreferences } from '../api';

const KNOWN_COLORS = {
  'Black': '#1a1a1a',
  'White': '#ffffff',
  'Blue': '#2563eb',
  'Grey': '#9ca3af',
  'Beige': '#d6c7a1',
  'Green': '#16a34a',
  'Red': '#dc2626',
  'Pastel Shades': 'linear-gradient(135deg,#fca5a5,#93c5fd,#bbf7d0)',
};

export default function EditPreferences({ onNavigate }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [originalAnswers, setOriginalAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPreferences();
        const qs = data.questions || [];
        setQuestions(qs);

        const initial = {};
        qs.forEach((q) => {
          let val = q.user_answer;
          if (val == null) val = [];
          if (!Array.isArray(val)) val = [val];
          val = val.filter((v) => v != null && v !== '');
          initial[q.id] = val;
        });

        setAnswers(initial);
        setOriginalAnswers(JSON.parse(JSON.stringify(initial)));
      } catch (e) {
        setError(e.message || 'Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (questionId, val) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const isColorQuestion = (q) => q.question_text.toLowerCase().includes('color');

  const customOptionsFor = (q) => {
    const labels = new Set(q.options.map((o) => o.text));
    const extras = (answers[q.id] || []).filter((v) => !labels.has(v));
    return extras.map((v) => ({ label: v, value: v }));
  };

  const toResponses = () => {
    const responses = {};
    questions.forEach((q) => {
      const val = answers[q.id] || [];
      const isSingle = q.question_type === 'single_choice';
      responses[q.id] = isSingle && val.length ? [val[val.length - 1]] : val;
    });
    return responses;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await updatePreferences(toResponses());
      onNavigate('profile');
    } catch (e) {
      setError(e.message || 'Failed to update preferences');
    } finally {
      setSubmitting(false);
    }
  };

  const hasChanges =
    JSON.stringify(answers) !== JSON.stringify(originalAnswers);

  return (
    <div className="w-full h-full flex flex-col bg-[#f9fafb] relative overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white border-b border-gray-100 shadow-sm rounded-b-3xl flex items-center gap-4">
        <button
          onClick={() => onNavigate('profile')}
          className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Edit Preferences</h1>
          <p className="text-sm text-gray-500 mt-0.5">Change your style preferences</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-28 px-6 mt-6">
        {loading ? (
          <div className="flex justify-center py-16 text-gray-400 text-sm">Loading preferences...</div>
        ) : error && !questions.length ? (
          <div className="text-red-500 text-sm text-center py-16">{error}</div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => {
              const isColor = isColorQuestion(q);
              const isSingle = q.question_type === 'single_choice';
              const selected = answers[q.id] || [];
              const allOptions = [
                ...q.options.map((o) => (isColor ? { label: o.text, value: o.text, color: KNOWN_COLORS[o.text] } : o.text)),
                ...customOptionsFor(q),
              ];

              return (
                <div key={q.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">{q.question_text}</label>
                  <Chips
                    options={allOptions}
                    selectedOptions={selected}
                    onChange={(val) => handleChange(q.id, val)}
                    multiSelect={!isSingle}
                    colorMode={isColor}
                  />
                </div>
              );
            })}

            {error && questions.length > 0 && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Submit button - appears when something changed */}
      {hasChanges && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[368px] z-20">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      )}
    </div>
  );
}