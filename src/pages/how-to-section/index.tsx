import React, { useRef } from 'react'
import styled from 'styled-components'
import './style.scss';
import { Typography } from '@mui/material';
import ProfesionalBrokerImage from '@svg/professional-broker';
import ShowingLoginImage from '@svg/showing-area';

const Main = styled.div``;
const ContainerRow = styled.div``;

export default function StepsToJoin(){
    let selectedStep = useRef(0);

    const stepsToRentOrBuyHouse = [
        {
          step: 1,
          title: "Criar uma conta",
          description: "Para iniciar o processo de alugar ou comprar uma casa, você precisa criar uma conta em nossa plataforma. Esta conta servirá como seu portal pessoal para gerenciar suas preferências de moradia, navegar pelos imóveis disponíveis e se comunicar com corretores de imóveis. Para criar uma conta, clique no botão 'Sign Up' na página inicial, forneça as informações pessoais necessárias e verifique seu endereço de e-mail. Depois que sua conta estiver configurada, você poderá começar a explorar as várias opções disponíveis.",
          active: true
        },
        {
          step: 2,
          title: "Selecionar o imóvel pretendido",
          description: "Após criar sua conta, o próximo passo é selecionar o imóvel desejado. Nossa plataforma oferece uma ampla gama de imóveis com várias características e faixas de preço para atender às suas necessidades. Use as opções de busca e filtro para restringir suas escolhas com base na localização, tipo de propriedade, preço e outras preferências. Uma vez que você encontre um imóvel que atenda aos seus critérios, você pode visualizar informações detalhadas, incluindo fotos, descrições e visitas virtuais, para ajudá-lo a tomar uma decisão informada.",
          active: false
        },
        {
          step: 3,
          title: "Entrar em contato com o corretor",
          description: "Depois de identificar um imóvel de seu interesse, o próximo passo é entrar em contato com o corretor responsável por esse imóvel. O corretor pode fornecer informações adicionais, responder a quaisquer perguntas que você possa ter e agendar uma visita, se necessário. Você pode entrar em contato diretamente com o corretor através de nossa plataforma clicando no botão 'Contact Agent' na página de listagem do imóvel. Preencha o formulário de contato com sua mensagem e o corretor retornará seu contato prontamente para ajudar com sua solicitação.",
          active: false
        },
        {
          step: 4,
          title: "Finalizar o pedido",
          description: "O passo final é finalizar seu pedido. Após discutir os detalhes com o corretor e confirmar seu interesse no imóvel, você prosseguirá para completar a documentação necessária e os acordos. O corretor irá orientá-lo durante o processo, incluindo quaisquer documentos exigidos, termos de pagamento e considerações legais. Depois que tudo estiver em ordem, você assinará o contrato de aluguel ou compra, tornando a transação oficial. Parabéns, você está pronto para se mudar para sua nova casa!",
          active: false
        }
      ];
      
      // Example of accessing the data
      const handleClick = (item,index)=>{
        stepsToRentOrBuyHouse.some(item=>item.active && (item.active = !item.active) )
        stepsToRentOrBuyHouse[index].active = true

        console.log(stepsToRentOrBuyHouse)
      }
      
    return (
    <Main className='steps-to-join'>
        <Typography variant='h3' sx={{
            fontFamily:'gotham-medium',
            marginBottom: '2em'
        }}>
            Como alugar ou comprar imovel
            com a Resimovel
        </Typography>
        <ContainerRow className='grid-container'>
            <div className='step-to-show-grid'>
                    <Typography variant='h4'>
                                    01
                        Criar uma conta
                    </Typography>
                    
                    <Typography className='intro-title-describe-step-description'>
                        não vai alugar connosco,
                        apenas nós iremos
                        publicitar os imóveis 
                        dos nossos clientes
                    </Typography>
                    
                    <div className='learn-more'>
                        <Typography>Saber mais</Typography>
                    </div>
                    <div className="second-order">
                        <ShowingLoginImage/>
                    </div>

            </div>
            <div className='steps-to-join'>
            { stepsToRentOrBuyHouse.map((item,index)=>(

                    <div className={`how-to-cards ${item.active && 'active'}`}
                    onClick={()=>{handleClick(item,index)}}
                    ref={selectedStep} 
                    >
                        <Typography variant='h5'>
                                            0{++index} <br/>
                            {item.title}
                        </Typography>
                        <Typography>
                            {item.description.slice(0, ( (item.description.length-1) /3) )}
                        </Typography>
                    </div>
            ))
                }
            </div>
        </ContainerRow>
    </Main>)   
}