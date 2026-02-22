/**
 * Google Maps API Diagnostics
 * This utility helps debug Google Maps and Places API initialization issues
 * 
 * Usage: Open browser console and run: window.checkGoogleMapsDiagnostics()
 */

export const diagnostics = {
  /**
   * Check if all required Google Maps APIs are available
   */
  checkAPIs() {
    console.group('🔍 Google Maps API Diagnostics');

    const checks = {
      'window.google': !!window.google,
      'window.google.maps': !!window.google?.maps,
      'window.google.maps.places': !!window.google?.maps?.places,
      'AutocompleteService': !!window.google?.maps?.places?.AutocompleteService,
      'PlacesService': !!window.google?.maps?.places?.PlacesService,
      'Geocoder': !!window.google?.maps?.Geocoder,
    };

    Object.entries(checks).forEach(([api, available]) => {
      console.log(`${available ? '✅' : '❌'} ${api}: ${available ? 'Available' : 'Missing'}`);
    });

    console.groupEnd();
    return checks;
  },

  /**
   * Check environment variables
   */
  checkEnv() {
    console.group('🔐 Environment Variables');

    const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;

    console.log('VITE_GOOGLE_MAP_API_KEY:', apiKey ? `✅ Present (${apiKey.substring(0, 10)}...)` : '❌ Missing');
    console.log('VITE_API_URL:', apiUrl || '❌ Missing');
    console.log('MODE:', import.meta.env.MODE);
    console.log('DEV:', import.meta.env.DEV);
    console.log('PROD:', import.meta.env.PROD);

    console.groupEnd();

    return {
      hasApiKey: !!apiKey,
      hasApiUrl: !!apiUrl,
      apiKeyLength: apiKey?.length || 0,
    };
  },

  /**
   * Test Places API
   */
  testPlacesAPI() {
    console.group('🧪 Places API Test');

    if (!window.google?.maps?.places?.AutocompleteService) {
      console.error('❌ AutocompleteService not available');
      console.groupEnd();
      return false;
    }

    try {
      const service = new window.google.maps.places.AutocompleteService();
      console.log('✅ AutocompleteService instantiated successfully');

      // Try a test request (but this will fail without valid API key)
      const request = {
        input: 'Luanda',
        types: ['geocode'],
        componentRestrictions: { country: 'AO' },
      };

      console.log('Testing with request:', request);
      service.getPlacePredictions(request, (predictions, status) => {
        const statusName = window.google?.maps?.places?.PlacesServiceStatus?.[status];
        console.log(`Response Status: ${status} (${statusName})`);
        
        if (status === 'OK') {
          console.log('✅ Test successful! Predictions:', predictions);
        } else if (status === 'REQUEST_DENIED') {
          console.error('❌ Request Denied - API Key is invalid or Places API is not enabled');
          console.log('Actions to fix:');
          console.log('1. Go to https://console.cloud.google.com');
          console.log('2. Create a new API key or use existing one');
          console.log('3. Enable "Places API" for that key');
          console.log('4. Add to .env: VITE_GOOGLE_MAP_API_KEY=your_key_here');
        } else if (status === 'ZERO_RESULTS') {
          console.log('ℹ️ No results found (but API is working)');
        } else {
          console.warn(`⚠️ Unexpected status: ${status}`);
        }
      });

      console.groupEnd();
      return true;
    } catch (err) {
      console.error('❌ Error testing Places API:', err);
      console.groupEnd();
      return false;
    }
  },

  /**
   * Full diagnostic report
   */
  report() {
    console.clear();
    console.log('%c 🚀 Google Maps Diagnostic Report', 'font-size: 16px; font-weight: bold; color: #0066cc;');
    console.log('=====================================\n');

    const envCheck = this.checkEnv();
    const apiCheck = this.checkAPIs();
    const allAvailable = Object.values(apiCheck).every(v => v);

    console.group('📊 Summary');
    console.log(`API Key: ${envCheck.hasApiKey ? '✅' : '❌'}`);
    console.log(`All APIs Available: ${allAvailable ? '✅' : '❌'}`);
    console.log(`Google Maps Status: ${window.google ? '✅ Loaded' : '❌ Not loaded'}`);
    console.groupEnd();

    console.log('\n💡 Next Steps:');
    if (!envCheck.hasApiKey) {
      console.log('1. Add Google Maps API key to /frontend-main/.env');
      console.log('2. Set VITE_GOOGLE_MAP_API_KEY=your_api_key');
      console.log('3. Restart dev server (npm run dev)');
    } else if (!allAvailable) {
      console.log('1. Clear browser cache (Ctrl+Shift+Delete)');
      console.log('2. Hard refresh page (Ctrl+Shift+R)');
      console.log('3. Check browser console for script load errors');
    } else {
      console.log('✅ Everything looks good!');
      console.log('2. Try using the location search again');
      console.log('3. If still failing, run: window.diagnostics.testPlacesAPI()');
    }

    console.log('\n=====================================\n');
  },
};

// Expose to window for easy access in browser console
if (typeof window !== 'undefined') {
  window.checkGoogleMapsDiagnostics = () => diagnostics.report();
  window.diagnostics = diagnostics;
  console.log('💡 Run checkGoogleMapsDiagnostics() in console to check setup');
}

export default diagnostics;
