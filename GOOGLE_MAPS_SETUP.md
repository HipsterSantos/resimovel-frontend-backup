# Frontend Setup Guide - Google Maps API

## 🔑 Google Maps API Configuration

This project uses Google Maps Places API for location search in the CreateImovel form.

### Prerequisites

You need a Google Maps API key with the following APIs enabled:
- **Maps JavaScript API**
- **Places API**
- **Geocoding API** (optional, for backend geocoding)

### Step 1: Get Your API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the required APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create an API key (Credentials → Create Credentials → API Key)
5. Restrict the key to Browser applications
6. Add allowed referrers:
   - `http://localhost:5173`
   - `http://localhost` 
   - Your production domain

### Step 2: Configure Environment Variables

Create a `.env` file in the `frontend-main/` directory:

```bash
# Google Maps Configuration
VITE_GOOGLE_MAP_API_KEY=AIzaSyAy5Ti-l_JVm2Iw4yKF1zhivOi98Vo69So

# Backend API URL
VITE_API_URL=http://localhost:4000/graphql
```

**Note:** Replace the API key with your actual key from Google Cloud Console.

### Step 3: Verify Setup

The app includes a diagnostic tool to verify Google Maps is properly configured:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open browser DevTools (F12)

3. In the console, run:
   ```javascript
   checkGoogleMapsDiagnostics()
   ```

4. You should see:
   - ✅ Environment variables loaded
   - ✅ All Google Maps APIs available
   - ✅ Places API working (if you test it)

### Step 4: Test Location Search

1. Navigate to the CreateImovel form
2. Try typing a location in the "Bairro" (neighborhood) field
3. You should see location suggestions appearing

## 🚨 Troubleshooting

### "API Key Missing" Error
- Check that `.env` file exists in `frontend-main/`
- Verify `VITE_GOOGLE_MAP_API_KEY` is set correctly
- Restart dev server after changing `.env`

### "REQUEST_DENIED" Status
- This means the API key is invalid or Places API is not enabled
- Go to Google Cloud Console
- Enable "Places API" for your project
- Verify API key restrictions allow your domain

### "Autocomplete not working"
Run diagnostics: `window.diagnostics.testPlacesAPI()`

This will test if the API is working and show the exact error.

### Suggestions Not Appearing
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+Shift+R)
- Check browser console for errors
- Run `checkGoogleMapsDiagnostics()` in console

## 📝 Environment Variables Reference

| Variable | Purpose | Example |
|---|---|---|
| `VITE_GOOGLE_MAP_API_KEY` | Google Maps API Key | `AIzaSy...` |
| `VITE_API_URL` | Backend GraphQL endpoint | `http://localhost:4000/graphql` |

## 🔍 Diagnostic Tools

The app includes a built-in diagnostic tool accessible in the browser console:

```javascript
// Show full diagnostic report
checkGoogleMapsDiagnostics()

// Or access individual checks:
window.diagnostics.checkEnv()           // Check env variables
window.diagnostics.checkAPIs()          // Check Google APIs
window.diagnostics.testPlacesAPI()      // Test Places API functionality
```

## 📚 Component Documentation

### GoogleMapDropdown Component
Located in: `src/components/google-map-dropdown/index.jsx`

**Features:**
- Autocomplete location suggestions (Angola only)
- Error handling and state management
- Session tokens for API efficiency
- Comprehensive logging for debugging

**Usage:**
```jsx
<GoogleMapDropdown
  property="Bairro"
  placeholder="Palanca (Kilamba Kiaxi)"
  value={values.fullAddress}
  error={!!errors.fullAddress}
  helperText={errors.fullAddress}
  required={true}
  onSelect={(place) => {
    handleChange('fullAddress')(place.description);
    handleChange('location')({
      lat: place.geometry?.location?.lat(),
      lng: place.geometry?.location?.lng(),
    });
  }}
/>
```

### GoogleMapProvider Context
Located in: `src/contexts/google.map.context.jsx`

Provides:
- `isLoaded`: Boolean indicating if Maps is loaded
- `loadError`: Any errors during initialization
- `mapInstance`: Reference to map instance
- `defaultCenter`: Default center (Luanda, Angola)
- `bounds`: Country bounds
- `countryCode`: Country code ('AO')

## 🔗 Resources

- [Google Maps Documentation](https://developers.google.com/maps/documentation)
- [Places API Guide](https://developers.google.com/maps/documentation/places/web-service)
- [Get Started with Google Cloud](https://cloud.google.com/docs/setup)
