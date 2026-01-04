import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, ArrowLeft, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Category {
    id: string;
    name: string;
    price: string;
}

interface InfoSection {
    id: string;
    title: string;
    content: string;
}

interface Sponsor {
    id: string;
    name: string;
    logoUrl: string;
}

const AdminAddEvent: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        deadline: '',
        razorpayLink: '',
        googleFormUrl: '',
        courseMapUrl: '',
        registrationStatus: 'open' as 'open' | 'closed'
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const [categories, setCategories] = useState<Category[]>([
        { id: '1', name: 'U-4 Balance Bike', price: '499' }
    ]);

    const [infoSections, setInfoSections] = useState<InfoSection[]>([
        { id: '1', title: 'Participation Fee', content: '' }
    ]);

    const [sponsors, setSponsors] = useState<Sponsor[]>([]);

    const [notification, setNotification] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Category handlers
    const addCategory = () => {
        setCategories(prev => [
            ...prev,
            { id: Date.now().toString(), name: '', price: '' }
        ]);
    };

    const removeCategory = (id: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
    };

    const updateCategory = (id: string, field: 'name' | 'price', value: string) => {
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, [field]: value } : cat
        ));
    };

    // Info Section handlers
    const addInfoSection = () => {
        setInfoSections(prev => [
            ...prev,
            { id: Date.now().toString(), title: '', content: '' }
        ]);
    };

    const removeInfoSection = (id: string) => {
        setInfoSections(prev => prev.filter(section => section.id !== id));
    };

    const updateInfoSection = (id: string, field: 'title' | 'content', value: string) => {
        setInfoSections(prev => prev.map(section =>
            section.id === id ? { ...section, [field]: value } : section
        ));
    };

    // Sponsor handlers
    const addSponsor = () => {
        setSponsors(prev => [
            ...prev,
            { id: Date.now().toString(), name: '', logoUrl: '' }
        ]);
    };

    const removeSponsor = (id: string) => {
        setSponsors(prev => prev.filter(sponsor => sponsor.id !== id));
    };

    const updateSponsor = (id: string, field: 'name' | 'logoUrl', value: string) => {
        setSponsors(prev => prev.map(sponsor =>
            sponsor.id === id ? { ...sponsor, [field]: value } : sponsor
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageUrl = '';

            // Upload image to Supabase Storage if provided
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('event-images')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('event-images')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            // Insert event
            const { data: eventData, error: eventError } = await supabase
                .from('events')
                .insert([{
                    name: formData.name,
                    date: formData.date,
                    time: formData.time,
                    location: formData.location,
                    description: formData.description,
                    deadline: formData.deadline,
                    razorpay_link: formData.razorpayLink,
                    google_form_url: formData.googleFormUrl || null,
                    image_url: imageUrl || null,
                    course_map_url: formData.courseMapUrl || null,
                    registration_status: formData.registrationStatus
                }])
                .select()
                .single();

            if (eventError) throw eventError;

            const eventId = eventData.id;

            // Insert categories
            if (categories.length > 0) {
                const categoryInserts = categories.map(cat => ({
                    event_id: eventId,
                    name: cat.name,
                    price: parseFloat(cat.price)
                }));

                const { error: catError } = await supabase
                    .from('event_categories')
                    .insert(categoryInserts);

                if (catError) throw catError;
            }

            // Insert info sections
            if (infoSections.length > 0) {
                const infoInserts = infoSections.map((section, index) => ({
                    event_id: eventId,
                    title: section.title,
                    content: section.content,
                    order: index
                }));

                const { error: infoError } = await supabase
                    .from('event_info_sections')
                    .insert(infoInserts);

                if (infoError) throw infoError;
            }

            // Insert sponsors
            if (sponsors.length > 0) {
                const sponsorInserts = sponsors.map((sponsor, index) => ({
                    event_id: eventId,
                    name: sponsor.name,
                    logo_url: sponsor.logoUrl,
                    order: index
                }));

                const { error: sponsorError } = await supabase
                    .from('event_sponsors')
                    .insert(sponsorInserts);

                if (sponsorError) throw sponsorError;
            }

            setNotification(`Event Saved Successfully! Event ID: ${eventId}`);
            setTimeout(() => setNotification(null), 5000);

            // Reset form
            setFormData({
                name: '',
                date: '',
                time: '',
                location: '',
                description: '',
                deadline: '',
                razorpayLink: '',
                googleFormUrl: '',
                courseMapUrl: '',
                registrationStatus: 'open'
            });
            setImageFile(null);
            setImagePreview('');
            setCategories([{ id: '1', name: 'U-4 Balance Bike', price: '499' }]);
            setInfoSections([{ id: '1', title: 'Participation Fee', content: '' }]);
            setSponsors([]);

        } catch (error: any) {
            console.error('Error saving event:', error);
            setNotification(`Error: ${error.message}`);
            setTimeout(() => setNotification(null), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark p-6 md:p-12 text-white">
            <div className="max-w-4xl mx-auto">
                <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={18} /> Back to Home
                </a>

                <div className="flex justify-between items-center mb-12">
                    <h1 className="font-display font-bold text-4xl">Admin <span className="text-brand-gold">Add Event</span></h1>
                </div>

                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${notification.includes('Error') ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-green-500/10 border-green-500 text-green-500'} border p-4 rounded-xl mb-8 font-bold text-center`}
                    >
                        {notification}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Event Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none transition-colors"
                                placeholder="e.g. Monsoon Cup 2026"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none transition-colors"
                                placeholder="e.g. Jio World Garden, Mumbai"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none transition-colors"
                            placeholder="Event details..."
                            required
                        />
                    </div>

                    {/* Banner Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase">Event Banner</label>
                        <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-brand-gold/50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {imagePreview ? (
                                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <Upload size={32} />
                                    <span>Click to Upload Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-400 uppercase">Race Categories</label>
                            <button
                                type="button"
                                onClick={addCategory}
                                className="text-brand-gold text-sm font-bold flex items-center gap-1 hover:text-white transition-colors"
                            >
                                <Plus size={16} /> Add Category
                            </button>
                        </div>
                        <div className="space-y-3">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Category Name (e.g. U-5)"
                                        value={cat.name}
                                        onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:outline-none"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price (₹)"
                                        value={cat.price}
                                        onChange={(e) => updateCategory(cat.id, 'price', e.target.value)}
                                        className="w-32 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:outline-none"
                                        required
                                    />
                                    {categories.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeCategory(cat.id)}
                                            className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Sections */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-400 uppercase">Information Sections</label>
                            <button
                                type="button"
                                onClick={addInfoSection}
                                className="text-brand-gold text-sm font-bold flex items-center gap-1 hover:text-white transition-colors"
                            >
                                <Plus size={16} /> Add Section
                            </button>
                        </div>
                        <div className="space-y-4">
                            {infoSections.map((section) => (
                                <div key={section.id} className="bg-black/20 border border-white/10 rounded-xl p-4 space-y-3">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Section Title (e.g. Eligibility)"
                                            value={section.title}
                                            onChange={(e) => updateInfoSection(section.id, 'title', e.target.value)}
                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:outline-none"
                                            required
                                        />
                                        {infoSections.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeInfoSection(section.id)}
                                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        placeholder="Section content..."
                                        value={section.content}
                                        onChange={(e) => updateInfoSection(section.id, 'content', e.target.value)}
                                        rows={3}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:outline-none"
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sponsors */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-400 uppercase">Sponsors</label>
                            <button
                                type="button"
                                onClick={addSponsor}
                                className="text-brand-gold text-sm font-bold flex items-center gap-1 hover:text-white transition-colors"
                            >
                                <Plus size={16} /> Add Sponsor
                            </button>
                        </div>
                        <div className="space-y-3">
                            {sponsors.map((sponsor) => (
                                <div key={sponsor.id} className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Sponsor Name"
                                        value={sponsor.name}
                                        onChange={(e) => updateSponsor(sponsor.id, 'name', e.target.value)}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:outline-none"
                                    />
                                    <input
                                        type="url"
                                        placeholder="Logo URL"
                                        value={sponsor.logoUrl}
                                        onChange={(e) => updateSponsor(sponsor.id, 'logoUrl', e.target.value)}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSponsor(sponsor.id)}
                                        className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Registration Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Registration Status</label>
                            <select
                                name="registrationStatus"
                                value={formData.registrationStatus}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none transition-colors"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Razorpay Payment Link</label>
                            <input
                                type="url"
                                name="razorpayLink"
                                value={formData.razorpayLink}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none transition-colors"
                                placeholder="https://rzp.io/..."
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Course Map URL</label>
                            <input
                                type="url"
                                name="courseMapUrl"
                                value={formData.courseMapUrl}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none transition-colors"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Google Script Webhook URL</label>
                            <input
                                type="url"
                                name="googleFormUrl"
                                value={formData.googleFormUrl}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none transition-colors"
                                placeholder="https://script.google.com/macros/s/.../exec"
                            />
                            <p className="text-xs text-gray-500">
                                Deploy the Google Apps Script via Extensions &gt; Apps Script in your Sheet.
                                <a href="/google_apps_script.js" target="_blank" className="text-brand-gold underline ml-1">View Script Code</a>
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-brand-gold to-brand-yellow text-brand-dark font-display font-bold text-xl py-4 rounded-xl shadow-lg hover:shadow-brand-gold/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} /> {isLoading ? 'Saving...' : 'Save Event'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminAddEvent;
