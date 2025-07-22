import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Circle, Plus, Trash2, Edit3, Save, X, Sun, Moon, Download, Upload } from 'lucide-react';

// Utility Functions
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage?.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage?.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

const useDarkMode = () => {
  const [isDark, setIsDark] = useLocalStorage('darkMode', false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return [isDark, setIsDark];
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const exportData = (data, filename) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// UI Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({ value, onChange, placeholder, className = '' }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300 ${className}`}
  />
);

const Checkbox = ({ checked, onChange, children }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {checked ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <Circle className="w-5 h-5 text-gray-400" />
      )}
    </div>
    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
      {children}
    </span>
  </label>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Layout Components
const Navbar = ({ darkMode, toggleDarkMode, onExport, onImport }) => (
  <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Daily Glow Tracker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
            <Button variant="secondary" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </label>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'skincare', name: 'Skincare', emoji: '✨' },
    { id: 'haircare', name: 'Haircare', emoji: '💁‍♀️' },
    { id: 'supplements', name: 'Supplements', emoji: '💊' },
    { id: 'study', name: 'Study', emoji: '📚' },
    { id: 'bodycare', name: 'Body Care', emoji: '🧴' },
    { id: 'exercise', name: 'Exercise', emoji: '🏃‍♀️' }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 h-full">
      <nav className="p-4">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{tab.emoji}</span>
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Generic Tracker Component
const TrackerPage = ({ title, items, setItems, defaultItems = [] }) => {
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');
  const today = new Date().toDateString();

  const addItem = () => {
    if (newItem.trim()) {
      const item = {
        id: Date.now(),
        name: newItem.trim(),
        completed: {},
        createdAt: new Date().toISOString()
      };
      setItems([...items, item]);
      setNewItem('');
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleComplete = (id) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newCompleted = { ...item.completed };
        newCompleted[today] = !newCompleted[today];
        return { ...item, completed: newCompleted };
      }
      return item;
    }));
  };

  const startEditing = (item) => {
    setEditingItem(item.id);
    setEditValue(item.name);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      setItems(items.map(item => 
        item.id === editingItem 
          ? { ...item, name: editValue.trim() }
          : item
      ));
    }
    setEditingItem(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const addDefaultItems = () => {
    const newDefaults = defaultItems.map(name => ({
      id: Date.now() + Math.random(),
      name,
      completed: {},
      createdAt: new Date().toISOString()
    }));
    setItems([...items, ...newDefaults]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {defaultItems.length > 0 && items.length === 0 && (
          <Button onClick={addDefaultItems}>
            Add Default Items
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <div className="flex space-x-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Add new ${title.toLowerCase()} item...`}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
            />
            <Button onClick={addItem}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox
                  checked={!!item.completed[today]}
                  onChange={() => toggleComplete(item.id)}
                />
                {editingItem === item.id ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    />
                    <Button size="sm" onClick={saveEdit}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={cancelEdit}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <span className={`text-gray-900 dark:text-gray-100 ${
                    item.completed[today] ? 'line-through opacity-60' : ''
                  }`}>
                    {item.name}
                  </span>
                )}
              </div>
              {editingItem !== item.id && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditing(item)}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
        
        {items.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No {title.toLowerCase()} items yet. Add one above to get started!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

// Page Components
const Skincare = ({ items, setItems }) => (
  <TrackerPage
    title="Skincare"
    items={items}
    setItems={setItems}
    defaultItems={[
      'Morning cleanser',
      'Vitamin C serum',
      'Moisturizer with SPF',
      'Evening cleanser',
      'Retinol (3x/week)',
      'Night moisturizer'
    ]}
  />
);

const Haircare = ({ items, setItems }) => (
  <TrackerPage
    title="Hair Care"
    items={items}
    setItems={setItems}
    defaultItems={[
      'Shampoo',
      'Conditioner',
      'Hair oil treatment',
      'Scalp massage',
      'Protective styling',
      'Heat protectant'
    ]}
  />
);

const Supplements = ({ items, setItems }) => (
  <TrackerPage
    title="Supplements"
    items={items}
    setItems={setItems}
    defaultItems={[
      'Multivitamin',
      'Vitamin D',
      'Omega-3',
      'Probiotics',
      'Vitamin C',
      'B-Complex'
    ]}
  />
);

const Study = ({ items, setItems }) => (
  <TrackerPage
    title="Study"
    items={items}
    setItems={setItems}
    defaultItems={[
      'Read for 30 minutes',
      'Review notes',
      'Practice problems',
      'Flashcard review',
      'Journal writing',
      'Research topic'
    ]}
  />
);

const Bodycare = ({ items, setItems }) => (
  <TrackerPage
    title="Body Care"
    items={items}
    setItems={setItems}
    defaultItems={[
      'Body moisturizer',
      'Exfoliate',
      'Nail care',
      'Foot care',
      'Body scrub',
      'Self-massage'
    ]}
  />
);

const Exercise = ({ items, setItems }) => (
  <TrackerPage
    title="Exercise"
    items={items}
    setItems={setItems}
    defaultItems={[
      'Cardio workout',
      'Strength training',
      'Stretching',
      'Walk 10k steps',
      'Yoga',
      'Core exercises'
    ]}
  />
);

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('skincare');
  const [darkMode, toggleDarkMode] = useDarkMode();
  
  // Data storage for each category
  const [skincareItems, setSkincareItems] = useLocalStorage('skincare-items', []);
  const [haircareItems, setHaircareItems] = useLocalStorage('haircare-items', []);
  const [supplementsItems, setSupplementsItems] = useLocalStorage('supplements-items', []);
  const [studyItems, setStudyItems] = useLocalStorage('study-items', []);
  const [bodycareItems, setBodycareItems] = useLocalStorage('bodycare-items', []);
  const [exerciseItems, setExerciseItems] = useLocalStorage('exercise-items', []);

  const handleExport = () => {
    const data = {
      skincare: skincareItems,
      haircare: haircareItems,
      supplements: supplementsItems,
      study: studyItems,
      bodycare: bodycareItems,
      exercise: exerciseItems,
      exportDate: new Date().toISOString()
    };
    exportData(data, 'daily-glow-tracker-backup.json');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.skincare) setSkincareItems(data.skincare);
          if (data.haircare) setHaircareItems(data.haircare);
          if (data.supplements) setSupplementsItems(data.supplements);
          if (data.study) setStudyItems(data.study);
          if (data.bodycare) setBodycareItems(data.bodycare);
          if (data.exercise) setExerciseItems(data.exercise);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'skincare':
        return <Skincare items={skincareItems} setItems={setSkincareItems} />;
      case 'haircare':
        return <Haircare items={haircareItems} setItems={setHaircareItems} />;
      case 'supplements':
        return <Supplements items={supplementsItems} setItems={setSupplementsItems} />;
      case 'study':
        return <Study items={studyItems} setItems={setStudyItems} />;
      case 'bodycare':
        return <Bodycare items={bodycareItems} setItems={setBodycareItems} />;
      case 'exercise':
        return <Exercise items={exerciseItems} setItems={setExerciseItems} />;
      default:
        return <Skincare items={skincareItems} setItems={setSkincareItems} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          onExport={handleExport}
          onImport={handleImport}
        />
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 overflow-auto">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;