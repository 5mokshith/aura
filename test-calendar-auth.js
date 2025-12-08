// Quick test script to check if Calendar API is accessible
// Run with: node test-calendar-auth.js

async function testCalendarAuth() {
    try {
        console.log('🔍 Testing Calendar API access...\n');

        // Test the token status endpoint
        const response = await fetch('http://localhost:3000/api/auth/token-status', {
            method: 'GET',
            headers: {
                'Cookie': 'aura_user_id=YOUR_USER_ID_HERE', // Replace with your actual user ID from cookies
            },
        });

        const data = await response.json();

        if (data.success && data.data) {
            console.log('✅ Token Status:', data.data.tokenStatus);
            console.log('📅 Scopes:', data.data.scopes);

            // Check if calendar scope is present
            const hasCalendarScope = data.data.scopes?.some(scope =>
                scope.includes('calendar')
            );

            if (hasCalendarScope) {
                console.log('\n✅ Calendar scope is authorized!');
            } else {
                console.log('\n❌ Calendar scope is MISSING!');
                console.log('   Please re-authenticate to get calendar access.');
            }
        } else {
            console.log('❌ No tokens found or error:', data.error);
            console.log('   Please log in first.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testCalendarAuth();
