import React, { useState, useEffect } from 'react';
import { Camera, History, Plus, Image as ImageIcon, ChevronRight, User, Globe } from 'lucide-react';
import { analyzeBusinessCard } from './services/geminiService';
import { ContactData, AppState, SupportedLanguage } from './types';
import { CardEditor } from './components/CardEditor';
import { LoadingOverlay } from './components/LoadingOverlay';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [isLoading, setIsLoading] = useState(false);
  const [currentContact, setCurrentContact] = useState<ContactData | null>(null);
  const [history, setHistory] = useState<ContactData[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage>('zh-TW');

  // Load history on mount with migration for old data structure
  useEffect(() => {
    const saved = localStorage.getItem('cardScannerHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration logic
        const migrated = parsed.map((item: any) => ({
            ...item,
            // Migrate single mobilePhone string to mobilePhones array
            mobilePhones: item.mobilePhones ? item.mobilePhones : (item.mobilePhone ? [item.mobilePhone] : []),
            workPhone: item.workPhone || (Array.isArray(item.phones) && item.phones.length > 0 ? item.phones[0] : ''),
            fax: item.fax || '',
            emails: item.emails || [],
        }));
        setHistory(migrated);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (contact: ContactData) => {
    const newHistory = [contact, ...history];
    setHistory(newHistory);
    localStorage.setItem('cardScannerHistory', JSON.stringify(newHistory));
    setAppState(AppState.HOME);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      
      try {
        const extractedData = await analyzeBusinessCard(base64String, language);
        
        const newContact: ContactData = {
          id: crypto.randomUUID(),
          originalImage: base64String,
          scannedAt: new Date().toISOString(),
          surname: extractedData.surname || '',
          givenName: extractedData.givenName || '',
          title: extractedData.title || '',
          company: extractedData.company || '',
          mobilePhones: extractedData.mobilePhones || [],
          workPhone: extractedData.workPhone || '',
          fax: extractedData.fax || '',
          emails: extractedData.emails || [],
          address: extractedData.address || '',
          website: extractedData.website || ''
        };

        setCurrentContact(newContact);
        setAppState(AppState.EDITING);
      } catch (error) {
        console.error("Detailed analysis error:", error);
        alert("Failed to analyze card. Please try again with better lighting.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderHome = () => (
    <div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto relative min-h-screen">
      <header className="px-6 pt-12 pb-6 bg-white shadow-sm z-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Cards<span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">AI Business Card Scanner</p>
        </div>
        
        {/* Language Selector */}
        <div className="flex flex-col items-end">
           <label className="flex items-center text-xs text-gray-400 mb-1">
             <Globe size={12} className="mr-1"/> Language
           </label>
           <select 
             value={language} 
             onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
             className="bg-gray-100 border-none text-sm font-semibold rounded-lg py-1 px-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
           >
             <option value="zh-TW">繁體中文</option>
             <option value="zh-CN">简体中文</option>
             <option value="en">English</option>
             <option value="ja">日本語</option>
           </select>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 mt-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <History size={32} />
            </div>
            <p>No scanned cards yet.</p>
            <p className="text-sm mt-2">Tap + to start scanning</p>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Scans</h2>
            {history.map((card) => (
              <div 
                key={card.id} 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 active:scale-95 transition-transform cursor-pointer"
                onClick={() => {
                  setCurrentContact(card);
                  setAppState(AppState.EDITING);
                }}
              >
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                  {card.surname ? card.surname[0] : <User size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold truncate">
                    {card.surname} {card.givenName}
                  </h3>
                  <p className="text-gray-500 text-sm truncate">{card.company}</p>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Floating Action Button / Camera Bar */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20">
         <div className="bg-white/90 backdrop-blur-md rounded-full shadow-2xl p-2 border border-gray-200 flex space-x-4">
            <label className="flex flex-col items-center justify-center w-16 h-16 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-600/30 active:scale-90 transition-transform cursor-pointer">
              <Camera size={28} />
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>
            <label className="flex flex-col items-center justify-center w-16 h-16 bg-gray-100 rounded-full text-gray-600 active:bg-gray-200 transition-colors cursor-pointer">
               <ImageIcon size={24} />
               <span className="text-[10px] font-medium mt-1">Upload</span>
               <input 
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>
         </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-gray-50 font-sans text-gray-900">
      {isLoading && <LoadingOverlay message="AI is reading card..." />}
      
      {appState === AppState.HOME && renderHome()}
      
      {appState === AppState.EDITING && currentContact && (
        <CardEditor 
          initialData={currentContact}
          onCancel={() => setAppState(AppState.HOME)}
          onSave={saveToHistory}
        />
      )}
    </div>
  );
}