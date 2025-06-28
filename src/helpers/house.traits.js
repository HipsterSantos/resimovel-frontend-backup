export const typeOfBusiness = [
    {
      label: 'Venda',
    },
    {
      label: 'Arrendamento',
    }
  ]

export const houseTraits = [
    {
        label: 'Casas e Apartamentos',
        onlyRent: false,
        traits: {
            label: 'Tipo de casa',
            values:  [
                {
                    label:'Apartamentos'
                },
                {
                    label:'Casas e Moradias'
                },
                {
                    label:'Quinta e Casas Rústicas'
                },
                {
                    label:'Duplex'
                },
                {
                    label:'Penthouse'
                }
            ],
        }
    },
    {
        label: 'Escritórios',
        onlyRent: false,
        traits: false
    },
    {
        label: 'Espaços comerciais ou armazéns',
        onlyRent: false,
        traits: {
            label: 'Tipo de espaço comercial ou armazém',
            values:[
                {
                    label: 'Espaço comercial'
                },
                {
                    label: 'Armazém'
                },
                {
                    label: 'Hotelaria'
                },
            ],
        }
    },
    {
        label: 'Garagens',
        onlyRent: false,
        traits: null
    },
    {
        label: 'Terrenos',
        onlyRent: false,
        traits: null
    },
    {
        label: 'Arrecadações',
        onlyRent: false,
        traits: null
    },
    {
        label: 'Prédios',
        onlyRent: false,
        traits: null
    },
    {
        label: 'Quartos',
        onlyRent: true,
    }
          
]