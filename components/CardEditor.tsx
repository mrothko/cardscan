import React, { useState } from 'react';
import { ContactData } from '../types';
import { downloadVCard } from '../services/vcardGenerator';

interface CardEditorProps {
  initialData: ContactData;
  onSave: (data: ContactData) => void;
  onCancel: () => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ContactData>(initialData);

  const handleChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'emails' | 'mobilePhones', index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const handleSaveToContacts = () => {
    downloadVCard(formData);
    onSave(formData);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm border-b sticky top-0 z-10 flex justify-between items-center">
        <button 
          onClick={onCancel}
          className="text-red-500 font-medium text-sm"
        >
          Cancel
        </button>
        <h2 className="text-lg font-bold text-gray-800">Review Card</h2>
        <button 
          onClick={handleSaveToContacts}
          className="text-blue-600 font-bold text-sm"
        >
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        {/* Image Preview */}
        <div className="w-full h-48 bg-gray-200 rounded-xl overflow-hidden shadow-inner flex-shrink-0 relative">
          <img 
            src={formData.originalImage} 
            alt="Original Card" 
            className="w-full h-full object-contain bg-black"
          />
        </div>

        {/* Name Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <label className="text-xs font-semibold text-gray-400 uppercase">Surname (姓)</label>
            <input 
              type="text" 
              value={formData.surname} 
              onChange={(e) => handleChange('surname', e.target.value)}
              className="w-full mt-1 text-lg text-gray-900 outline-none font-medium bg-white" 
              placeholder="e.g. Wang"
            />
          </div>
          <div className="p-3">
            <label className="text-xs font-semibold text-gray-400 uppercase">Given Name (名)</label>
            <input 
              type="text" 
              value={formData.givenName} 
              onChange={(e) => handleChange('givenName', e.target.value)}
              className="w-full mt-1 text-lg text-gray-900 outline-none font-medium bg-white" 
              placeholder="e.g. Da-Ming"
            />
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <label className="text-xs font-semibold text-gray-400 uppercase">Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full mt-1 text-base text-gray-900 outline-none bg-white" 
            />
          </div>
          <div className="p-3">
            <label className="text-xs font-semibold text-gray-400 uppercase">Company</label>
            <input 
              type="text" 
              value={formData.company} 
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full mt-1 text-base text-gray-900 outline-none bg-white" 
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Mobile Phones */}
          {formData.mobilePhones.map((phone, idx) => (
             <div key={`mobile-${idx}`} className="p-3 border-b border-gray-100 last:border-0">
               <label className="text-xs font-semibold text-gray-400 uppercase">Mobile {idx + 1} (手機)</label>
               <input 
                 type="tel" 
                 value={phone} 
                 onChange={(e) => handleArrayChange('mobilePhones', idx, e.target.value)}
                 className="w-full mt-1 text-base text-blue-600 outline-none bg-white"
                 placeholder="+1 234 567 890" 
               />
             </div>
          ))}
          {/* Fallback to show at least one mobile field if array is empty */}
          {formData.mobilePhones.length === 0 && (
             <div className="p-3 border-b border-gray-100">
               <label className="text-xs font-semibold text-gray-400 uppercase">Mobile 1 (手機)</label>
               <input 
                 type="tel" 
                 value=""
                 onChange={(e) => {
                   setFormData(prev => ({...prev, mobilePhones: [e.target.value]}));
                 }}
                 className="w-full mt-1 text-base text-blue-600 outline-none bg-white"
                 placeholder="+1 234 567 890" 
               />
             </div>
          )}

          {/* Work Phone */}
          <div className="p-3 border-b border-gray-100">
            <label className="text-xs font-semibold text-gray-400 uppercase">Work Phone (公司電話)</label>
            <input 
              type="tel" 
              value={formData.workPhone} 
              onChange={(e) => handleChange('workPhone', e.target.value)}
              className="w-full mt-1 text-base text-blue-600 outline-none bg-white"
              placeholder="+1 234 567 890" 
            />
          </div>

          {/* Fax */}
          <div className="p-3 border-b border-gray-100">
            <label className="text-xs font-semibold text-gray-400 uppercase">Fax (傳真)</label>
            <input 
              type="tel" 
              value={formData.fax} 
              onChange={(e) => handleChange('fax', e.target.value)}
              className="w-full mt-1 text-base text-blue-600 outline-none bg-white"
              placeholder="+1 234 567 890" 
            />
          </div>

          {/* Emails */}
          {formData.emails.map((email, idx) => (
             <div key={`email-${idx}`} className="p-3 border-b border-gray-100 last:border-0">
               <label className="text-xs font-semibold text-gray-400 uppercase">Email {idx + 1}</label>
               <input 
                 type="email" 
                 value={email} 
                 onChange={(e) => handleArrayChange('emails', idx, e.target.value)}
                 className="w-full mt-1 text-base text-blue-600 outline-none bg-white" 
               />
             </div>
          ))}
          
          <div className="p-3 border-t border-gray-100">
            <label className="text-xs font-semibold text-gray-400 uppercase">Address</label>
            <textarea 
              value={formData.address} 
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full mt-1 text-base text-gray-900 outline-none resize-none bg-white" 
              rows={3}
            />
          </div>
        </div>

        <div className="p-4 text-center text-xs text-gray-400">
          <p>Tap "Save" to add to iPhone Contacts.</p>
          <p>A note with the current timestamp will be added.</p>
        </div>
      </div>
    </div>
  );
};