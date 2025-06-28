import React, { useEffect, useState } from 'react';

const RequestLocationAccessPrompt= ({ onLocationGranted }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLocationAvailable, setIsLocationAvailable] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setErrorMessage(null);
          onLocationGranted(position.coords);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
                setErrorMessage('Por favor, ative os serviços de localização nas configurações do seu navegador.');
                break;
            case error.POSITION_UNAVAILABLE:
                setErrorMessage('Informações de localização não estão disponíveis.');
                break;
            case error.TIMEOUT:
                setErrorMessage('A solicitação para obter a localização do usuário expirou.');
                break;
            case error.UNKNOWN_ERROR:
                setErrorMessage('Ocorreu um erro desconhecido.');
                break;
            default:
                setErrorMessage('Ocorreu um erro.');
          }
          setIsLocationAvailable(false);
        }
      );
    } else {
      setIsLocationAvailable(false);
      setErrorMessage('Geolocation is not supported by this browser.');
    }
  }, [onLocationGranted]);

  return (
        <div>
        {errorMessage ? (
            <div>
            <p>{errorMessage}</p>
            {!isLocationAvailable && (
                <div>
                <p>Para ativar os serviços de localização:</p>
                <ul>
                    <li>Para Chrome: Vá para Configurações &gt; Privacidade e segurança &gt; Configurações do site &gt; Localização</li>
                    <li>Para Firefox: Vá para Opções &gt; Privacidade e segurança &gt; Permissões &gt; Localização</li>
                    <li>Para Safari: Vá para Preferências &gt; Sites &gt; Localização</li>
                </ul>
                </div>
            )}
            </div>
        ) : (
            <p>Solicitando sua localização...</p>
        )}
        </div>

  );
};

// const App = () => {
//   const handleLocationGranted = (coords) => {
//     console.log('User location granted:', coords);
//     // Use the location data (coords.latitude, coords.longitude)
//   };

//   return (
//     <div>
//       <h1>Location Request Example</h1>
//       <LocationPrompt onLocationGranted={handleLocationGranted} />
//     </div>
//   );
// };

export default App;
