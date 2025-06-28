export const menus = {
    landingPage: [
        {
            title: 'Profissional',
            alt: 'seja um profissional imobiliario',
            redirectTo: 'signup',
            icon:'',
            order: 2,
            type:'text',
            class: 'dropdwon professionais-dropdwon',
            submenus:[
                {
                    title: 'Ver Agências imobiliárias',
                    redirectTo: 'agencias',
                    alt: '',
                    icon: ''
                },
                {
                    title: 'Ver Promotores imobiliários',
                    redirectTo: 'promotores-individual',
                    alt: '',
                    icon: ''
                },
                {
                    title: 'Criar uma conta',
                    alt:'',
                    icon:'',
                    class:'dropdown-submenus dropdown-submenus-create-account',
                    submenus:[
                        {
                            title: 'Para Agência imobiliária',
                            redirectTo: 'signup/agencias-imobiliaria',
                            alt: '',
                            icon: ''
                        },
                        {
                            title: 'Para Promotor Imobiliário',
                            redirectTo: 'signup/promoter-individual',
                            alt: '',
                            icon: ''
                        }

                    ]
                },
                {
                    title: 'Ver Imoveis',
                    alt:'',
                    icon:''
                }
            ]
        },
        {
            title: 'Empreendimentos',
            alt: 'gere seu empreendimento aqui',
            icon:'',
            type:'text',
            class: 'dropdown empreendimentos-dropdown',
            order: 1,
            submenus:[
                {
                    title: 'Para comprar',
                    redirectTo:'comprar',
                    alt: 'to-buy-apartment',
                    icon: ''
                },
                {
                    title: 'Para alugar',
                    redirectTo:' alugar',
                    alt: 'to-rent-apartment',
                    icon: ''
                },
                {   
                    title: 'Anunciar empreendimento',
                    redirectTo: 'anuncios',
                    alt: '',
                    icon:'',
                },
                {
                    title: 'Ver empreendimento',
                    redirectTo: 'empreendimentos',
                    alt: '',
                    icon:'',
                }
            ]
        },
        
        {
            title: 'Publicar anuncio grátis',
            alt: 'gere seu empreendimento aqui',
            bgColor:'#D9F070',
            color:'',
            type: 'button',
            class:'signup-btn create-imovel',
            name:'createImovel',
            order:2
        },
        {
            title: 'Iniciar sessão',
            alt: 'gere seu empreendimento aqui',
            type: 'button',
            color:'',
            bgColor:'#F7F7F7',
            class:'login-btn',
            name:'login',
            allowAvatar: true,
            submenus:[
                {
                    title: 'Meu Perfil',
                    alt: '',
                    icon:'',
                    redirectTo:''
                },
                {
                    title: 'Comprar',
                    alt: '',
                    icon:'',
                    redirectTo:''
                },
                {
                    title: 'Favoritos',
                    alt: '',
                    icon:'',
                    redirectTo:''
                },
                {
                    title: 'Pesquisa',
                    alt: '',
                    icon:'',
                    redirectTo:''
                },
                {
                    title: 'Sair',
                    alt: '',
                    icon:'',
                    redirectTo:'',
                    class: 'logout-session close-session'
                },
            ],
            checkSession: ()=>{},
            order: 1
        }
    ],
    dashboard: [

            {
                title: 'Profissional',
                alt: 'seja um profissional imobiliario',
                icon:'',
                order: 1,
                submenus:[
                    {
                        title: '',
                        alt:'',
                        icon:''
                    }
                ]
        },
        {
            title: 'Definições',
            alt: 'seja um profissional imobiliario',
            icon:'',
            order: 2,
            submenus:[
                {
                    title: '',
                    alt:'',
                    icon:''
                }
            ]
        },
        {
            title: 'Perfil',
            alt: 'seja um profissional imobiliario',
            icon:'',
            order: 3,
            submenus:[
                {
                    title: '',
                    alt:'',
                    icon:''
                }
            ]
        }
    ]
}