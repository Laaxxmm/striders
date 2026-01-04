# Supabase Setup Instructions

## Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note down your **Project URL** and **Anon Key**

## Step 2: Run Database Migration
1. In your Supabase project dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase_migration.sql`
4. Click **Run** to execute the migration
5. This will create all necessary tables and storage buckets

## Step 3: Configure Environment Variables
1. Open the `.env` file in your project root
2. Replace the placeholders with your actual Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Restart Development Server
```bash
npm run dev
```

## Step 5: Test the System
1. Navigate to `/admin/add-event`
2. Create a test event with all fields
3. Click "Save Event"
4. Note the Event ID from the success message
5. Navigate to `/event/<event-id>` to view the generated landing page

## Troubleshooting

### Images not uploading?
- Check that the `event-images` bucket was created in Supabase Storage
- Verify the storage policies are set correctly (see migration file)

### Data not saving?
- Check browser console for errors
- Verify your Supabase credentials in `.env`
- Ensure Row Level Security policies are applied correctly

### Event not displaying?
- Verify the event ID is correct
- Check that all foreign key relationships are intact
- Look for errors in the browser console

## Next Steps
- Set up authentication for the admin panel
- Configure custom domain for Supabase Storage
- Add image optimization
- Implement event editing functionality
