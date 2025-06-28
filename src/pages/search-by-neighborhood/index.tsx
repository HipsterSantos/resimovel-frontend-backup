import { Typography } from '@mui/material';
import React from 'react'
import styled from 'styled-components'
import './style.scss';

const Main = styled.div`
display:flex; 
flex-direction: column;
`;

const RowOne = styled.div``;
const RowTwo = styled.div``
const RowThree = styled.div``

export default function FilterByNeighborhood(){
 return (
 <Main className='search-by-region-container'>
    <div className='search-by-neighborhood'>
        <RowOne className='rowOne'>
            <Typography variant='h5' sx={{fontFamily:'gotham-medium'}}>
            Pesquisa imóveis por municipios
                <span className='tiny-tittle' style={{
                    fontFamily:'gotham-medium',
                    fontSize: '13pt',
                    color: '#0880FD',
                    marginLeft: '1em'
                }}>
                    Arrendar casas e apartamentos
                </span>
            </Typography>
        </RowOne>
        <RowTwo className='rowTwo'>
                <div className='content'>
                    <Typography variant='h6'>
                        Arrendar
                    </Typography>
                    <Typography variant='h6'>
                        Comprar
                    </Typography>
                </div>
                <hr className='vertical-line'/>
        </RowTwo>
        <RowThree className='rowThree'>
            <div className='button-filter'>
                {[1].map((item,index)=>(
                    <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Apartamento</button>
                ))
                }
              {[1].map((item,index)=>(
                    <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Vivenda</button>
                ))
                }
              {[1].map((item,index)=>(
                    <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Quarto</button>
                ))
                }
              {[1].map((item,index)=>(
                    <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Casa e Moradia</button>
                ))
                }
              {[1].map((item,index)=>(
                    <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Escritório</button>
                ))
                }
              {[1].map((item,index)=>(
                    <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Loja</button>
                ))
                }
              {[1].map((item,index)=>(
                    <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Terreno</button>
                ))
                }
            </div>
         
       
        </RowThree>
     
    </div>
    
    <div className='neighborhood-list'>
        <Typography>
        Luanda(34)
        </Typography>
    
    </div>
    <div className='neighborhood-list'>
        <Typography>
        Luanda(34)
        </Typography>
    
    </div>
    <div className='search-by-region'>
        <Typography variant='h5'>
            Procurar por região
        </Typography>
     <RowTwo className='rowTwo'>
             
                <hr className='vertical-line'/>
        </RowTwo>
        <div className='button-filter'>
            {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Bengo</button>
            ))
            }
          {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Benguela</button>
            ))
            }
          {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Bié</button>
            ))
            }
          {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Cabinda</button>
            ))
            }
          {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Cuando Cubango</button>
            ))
            }
          {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Cuanza Norte</button>
            ))
            }
           {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Cuanza Sul</button>
            ))
            }
           {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Cunene</button>
            ))
            }
           {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Huambo</button>
            ))
            }
           {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Huíla</button>
            ))
            }
           {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Luanda</button>
            ))
            }
           {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Lunda Norte</button>
            ))
            }
           {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Lunda Sul</button>
            ))
            }
           {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Malanje</button>
            ))
            }
           {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Moxico</button>
            ))
            }
             {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Namibe</button>
            ))
            }
             {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Uíge</button>
            ))
            }
             {[1].map((item,index)=>(
                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>Zaire</button>
            ))
            }
         
        </div>
    </div>
 </Main>)   
}
