// Test if calendar creation works directly
// This bypasses the chat interface to test the underlying API

async function testCalendarDirect() {
    try {
        console.log('🔍 Testing direct calendar creation...\n');

        const testEvent = {
            summary: 'Test Calendar Event',
            description: 'This is a test event from AURA diagnostic',
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
        };

        console.log('Creating test event:', testEvent);

        // Note: You'll need to get your user ID from cookies first
        // Open browser console and type: document.cookie
        // Look for aura_user_id=XXXXX

        const response = await fetch('http://localhost:3000/api/calendar/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Replace with your actual cookie values
                'Cookie': 'aura_user_id=YOUR_USER_ID_HERE',
            },
            body: JSON.stringify(testEvent),
        });

        const data = await response.json();

        if (data.success) {
            console.log('\n✅ Calendar event created successfully!');
            console.log('Event data:', data.data);
        } else {
            console.log('\n❌ Failed to create calendar event');
            console.log('Error:', data.error);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Uncomment to run:
// testCalendarDirect();

console.log(`
📋 Instructions:
1. Get your user ID from browser cookies (document.cookie)
2. Replace YOUR_USER_ID_HERE with your actual user ID
3. Uncomment the last line
4. Run: node test-calendar-direct.js
`);
