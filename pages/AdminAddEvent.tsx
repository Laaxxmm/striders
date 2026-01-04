import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, ArrowLeft, Upload } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    price: string;
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
        image: '', // Will store data URL
    });

    const [categories, setCategories] = useState<Category[]>([
        { id: '1', name: 'U-4 Balance Bike', price: '499' }
    ]);

    const [notification, setNotification] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // In a real app, this would be an API call
        // For now, save to local storage
        const newEvent = {
            id: Date.now().toString(),
            ...formData,
            categories
        };

        const existingEvents = JSON.parse(localStorage.getItem('adminEvents') || '[]');
        localStorage.setItem('adminEvents', JSON.stringify([...existingEvents, newEvent]));

        setNotification('Event Saved Successfully!');
        setTimeout(() => setNotification(null), 3000);

        // Reset form
        setFormData({
            name: '',
            date: '',
            time: '',
            location: '',
            description: '',
            deadline: '',
            razorpayLink: '',
            image: '',
        });
        setCategories([{ id: '1', name: 'U-4 Balance Bike', price: '499' }]);
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
                        className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-xl mb-8 font-bold text-center"
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
                            {formData.image ? (
                                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
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
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-brand-gold to-brand-yellow text-brand-dark font-display font-bold text-xl py-4 rounded-xl shadow-lg hover:shadow-brand-gold/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={20} /> Save Event
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminAddEvent;
