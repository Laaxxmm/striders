import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, ArrowLeft, Upload, Edit, Eye, List } from 'lucide-react';
import { supabase, Event, EventCategory, EventInfoSection, EventSponsor } from '../lib/supabase';

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
    logoFile?: File | null;
}

const AdminAddEvent: React.FC = () => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [existingEvents, setExistingEvents] = useState<Event[]>([]);

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

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setExistingEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const loadEventForEdit = async (eventId: string) => {
        setIsLoading(true);
        try {
            // Fetch event
            const { data: eventData, error: eventError } = await supabase
                .from('events')
                .select('*')
                .eq('id', eventId)
                .single();

            if (eventError) throw eventError;

            // Set form data
            setFormData({
                name: eventData.name,
                date: eventData.date,
                time: eventData.time,
                location: eventData.location,
                description: eventData.description,
                deadline: eventData.deadline,
                razorpayLink: eventData.razorpay_link,
                googleFormUrl: eventData.google_form_url || '',
                courseMapUrl: eventData.course_map_url || '',
                registrationStatus: eventData.registration_status
            });

            setImagePreview(eventData.image_url || '');

            // Fetch categories
            const { data: categoriesData, error: categoriesError } = await supabase
                .from('event_categories')
                .select('*')
                .eq('event_id', eventId);

            if (categoriesError) throw categoriesError;
            setCategories(categoriesData.map((cat, index) => ({
                id: `temp-${index}-${Date.now()}`, // Use temporary ID to avoid conflicts
                name: cat.name,
                price: cat.price.toString()
            })));

            // Fetch info sections
            const { data: infoData, error: infoError } = await supabase
                .from('event_info_sections')
                .select('*')
                .eq('event_id', eventId)
                .order('order', { ascending: true });

            if (infoError) throw infoError;
            setInfoSections(infoData.map((section, index) => ({
                id: `temp-${index}-${Date.now()}`, // Use temporary ID
                title: section.title,
                content: section.content
            })));

            // Fetch sponsors
            const { data: sponsorsData, error: sponsorsError } = await supabase
                .from('event_sponsors')
                .select('*')
                .eq('event_id', eventId)
                .order('order', { ascending: true });

            if (sponsorsError) throw sponsorsError;
            setSponsors(sponsorsData.map((sponsor, index) => ({
                id: `temp-${index}-${Date.now()}`, // Use temporary ID
                name: sponsor.name,
                logoUrl: sponsor.logo_url
            })));

            setEditingEventId(eventId);
            setView('form');
        } catch (error: any) {
            console.error('Error loading event:', error);
            setNotification(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteEvent = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', eventId);

            if (error) throw error;

            setNotification('Event deleted successfully!');
            setTimeout(() => setNotification(null), 3000);

            // Immediately refresh the events list
            await fetchEvents();
        } catch (error: any) {
            console.error('Error deleting event:', error);
            setNotification(`Error: ${error.message}`);
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
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
        setEditingEventId(null);
    };

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
        setSponsors([...sponsors, { id: Date.now().toString(), name: '', logoUrl: '', logoFile: null }]);
    };

    const removeSponsor = (id: string) => {
        setSponsors(sponsors.filter(s => s.id !== id));
    };

    const updateSponsor = (id: string, field: keyof Sponsor, value: string) => {
        setSponsors(sponsors.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleSponsorLogoChange = (id: string, file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSponsors(sponsors.map(s =>
                    s.id === id ? { ...s, logoFile: file, logoUrl: reader.result as string } : s
                ));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageUrl = imagePreview;

            // Upload new image if provided
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('event-images')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('event-images')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            if (editingEventId) {
                // Update existing event
                const { error: eventError } = await supabase
                    .from('events')
                    .update({
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
                    })
                    .eq('id', editingEventId);

                if (eventError) throw eventError;

                // Delete old categories, info sections, and sponsors
                await supabase.from('event_categories').delete().eq('event_id', editingEventId);
                await supabase.from('event_info_sections').delete().eq('event_id', editingEventId);
                await supabase.from('event_sponsors').delete().eq('event_id', editingEventId);

                // Insert new ones
                if (categories.length > 0) {
                    const categoryInserts = categories.map(cat => ({
                        event_id: editingEventId,
                        name: cat.name,
                        price: parseFloat(cat.price)
                    }));
                    await supabase.from('event_categories').insert(categoryInserts);
                }

                if (infoSections.length > 0) {
                    const infoInserts = infoSections.map((section, index) => ({
                        event_id: editingEventId,
                        title: section.title,
                        content: section.content,
                        order: index
                    }));
                    await supabase.from('event_info_sections').insert(infoInserts);
                }

                if (sponsors.length > 0) {
                    const sponsorInserts = sponsors.map((sponsor, index) => ({
                        event_id: editingEventId,
                        name: sponsor.name,
                        logo_url: sponsor.logoUrl,
                        order: index
                    }));
                    await supabase.from('event_sponsors').insert(sponsorInserts);
                }

                setNotification('Event Updated Successfully!');
            } else {
                // Create new event (existing code)
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

                if (categories.length > 0) {
                    const categoryInserts = categories.map(cat => ({
                        event_id: eventId,
                        name: cat.name,
                        price: parseFloat(cat.price)
                    }));
                    await supabase.from('event_categories').insert(categoryInserts);
                }

                if (infoSections.length > 0) {
                    const infoInserts = infoSections.map((section, index) => ({
                        event_id: eventId,
                        title: section.title,
                        content: section.content,
                        order: index
                    }));
                    await supabase.from('event_info_sections').insert(infoInserts);
                }

                if (sponsors.length > 0) {
                    const sponsorInserts = await Promise.all(sponsors.map(async (sponsor, index) => {
                        let logoUrl = sponsor.logoUrl;

                        // Upload logo file if provided
                        if (sponsor.logoFile) {
                            const fileExt = sponsor.logoFile.name.split('.').pop();
                            const fileName = `${eventId}-sponsor-${index}-${Date.now()}.${fileExt}`;

                            const { error: uploadError } = await supabase.storage
                                .from('event-images')
                                .upload(fileName, sponsor.logoFile);

                            if (uploadError) {
                                console.error('Error uploading sponsor logo:', uploadError);
                            } else {
                                const { data: { publicUrl } } = supabase.storage
                                    .from('event-images')
                                    .getPublicUrl(fileName);
                                logoUrl = publicUrl;
                            }
                        }

                        return {
                            event_id: eventId,
                            name: sponsor.name,
                            logo_url: logoUrl,
                            order: index
                        };
                    }));

                    await supabase.from('event_sponsors').insert(sponsorInserts);
                }

                setNotification(`Event Created Successfully! Event ID: ${eventId}`);
            }

            setTimeout(() => setNotification(null), 5000);
            resetForm();
            fetchEvents();
            setView('list');

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
            <div className="max-w-6xl mx-auto">
                <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={18} /> Back to Home
                </a>

                <div className="flex justify-between items-center mb-12">
                    <h1 className="font-display font-bold text-4xl">Admin <span className="text-brand-gold">Panel</span></h1>
                    {view === 'list' && (
                        <button
                            onClick={() => { resetForm(); setView('form'); }}
                            className="bg-brand-gold text-brand-dark px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <Plus size={20} /> Create New Event
                        </button>
                    )}
                    {view === 'form' && (
                        <button
                            onClick={() => { resetForm(); setView('list'); }}
                            className="bg-white/10 text-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-colors flex items-center gap-2"
                        >
                            <List size={20} /> View All Events
                        </button>
                    )}
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

                {view === 'list' ? (
                    <div className="space-y-4">
                        {existingEvents.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
                                <p className="text-gray-400 text-lg">No events created yet. Click "Create New Event" to get started!</p>
                            </div>
                        ) : (
                            existingEvents.map((event) => (
                                <div key={event.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-gold/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-display font-bold text-2xl text-white">{event.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${event.registration_status === 'open' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                    {event.registration_status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-gray-400 space-y-1">
                                                <p>📅 {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                                                <p>📍 {event.location}</p>
                                                <p className="text-sm">Created: {new Date(event.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <a
                                                href={`/event/${event.id}`}
                                                target="_blank"
                                                className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                                title="View Event Page"
                                            >
                                                <Eye size={20} />
                                            </a>
                                            <button
                                                onClick={() => loadEventForEdit(event.id)}
                                                className="p-3 bg-brand-gold/20 text-brand-gold rounded-lg hover:bg-brand-gold/30 transition-colors"
                                                title="Edit Event"
                                            >
                                                <Edit size={20} />
                                            </button>
                                            <button
                                                onClick={() => deleteEvent(event.id)}
                                                className="p-3 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                                                title="Delete Event"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                        {editingEventId && (
                            <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4 mb-4">
                                <p className="text-brand-gold font-bold">Editing Event</p>
                            </div>
                        )}

                        {/* Rest of the form - same as before */}
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
                                    <div key={sponsor.id} className="bg-black/20 border border-white/10 rounded-lg p-4">
                                        <div className="flex gap-3 mb-3">
                                            <input
                                                type="text"
                                                placeholder="Sponsor Name"
                                                value={sponsor.name}
                                                onChange={(e) => updateSponsor(sponsor.id, 'name', e.target.value)}
                                                className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSponsor(sponsor.id)}
                                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <label className="flex-1 cursor-pointer">
                                                <div className="bg-black/30 border border-white/10 rounded-lg p-3 text-gray-400 hover:border-brand-gold transition-colors flex items-center gap-2">
                                                    <Upload size={20} />
                                                    <span>{sponsor.logoFile ? sponsor.logoFile.name : 'Upload Logo'}</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleSponsorLogoChange(sponsor.id, e.target.files?.[0] || null)}
                                                    className="hidden"
                                                />
                                            </label>
                                            {sponsor.logoUrl && (
                                                <div className="w-20 h-20 bg-white rounded-lg p-2 flex items-center justify-center">
                                                    <img src={sponsor.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                                </div>
                                            )}
                                        </div>
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

                        <div className="pt-6 border-t border-white/10 flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-brand-gold to-brand-yellow text-brand-dark font-display font-bold text-xl py-4 rounded-xl shadow-lg hover:shadow-brand-gold/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={20} /> {isLoading ? 'Saving...' : editingEventId ? 'Update Event' : 'Save Event'}
                            </button>
                            {editingEventId && (
                                <button
                                    type="button"
                                    onClick={() => { resetForm(); setView('list'); }}
                                    className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminAddEvent;
