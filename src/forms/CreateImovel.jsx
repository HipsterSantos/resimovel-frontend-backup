import React,{useState,useEffect} from "react";
import styled from 'styled-components'
import RightRadioSelected from "@svg/right-radio-selected";
import RightRadioNonSelected from "@svg/right-radio-non-selected";
import './style.scss'
import { Box, Typography } from "@mui/material";
import CustomInput from "../components/custom-input";
import CustomDropdown from "../components/custom-dropdown";
import CheckBoxWithIcon from "../components/checkbox-with-icon/checkbox-with-icon";

import Close from '@svg/close';
import HouseSolid from "@svg/house-solid";
import MapMarkerSolid from "@svg/map-marker-new";

import { houseTraits, typeOfBusiness,truncateWords, createImovelSteps} from "../helpers/index";
import GoogleMapDropdown from "../components/google-map-dropdown ";

const Main  = styled.div`
display: flex;
width: inherit;
height: inherit;
`;

const LeftSide = styled.div`
flex:2;
background: #FAFAFA;
height: auto;
// padding: 1em;
`;
const RightSide = styled.div`
background: #FAFAFA;
flex: 2;
height: auto; 
`;
const CenterSide = styled.div`
flex:5;
diplay: flex;
flex-direction: column;
`;

const List = styled.li`
list-style: none;
&> span{
    margin-top: auto;
    margin-bottm: auto;
}
`;


const BackwardBtn = styled.button`
color: #353535;
background: transparent;
border: 1px solid #353535;
padding: 1em 3em;
border-radius: .8em;
`
const ForwardBtn = styled.button`
color: #353535;
background: #D9EE78;
border: none;
width: 30vw;
padding: 1em 3em;
border-radius: .8em;

`
const StepOneContainer = styled.div`
padding: 2em 3em;
width: 100%;
`;
const Form = styled.form`
margin-top: 2em;
width: inherit;
margin-left: 1em;
&>*{
    margin-top: 1.5em;
}
`;

const Split = styled.div`
    width: 80%;    
    display:flex;
        &>*:nth-child(1){
            margin-right: 1em;
        }
        &>*:nth-child(2){
            margin-left: auto;
            // margin-right: 1.5em;
    }
`;


let steps = createImovelSteps
let componentsToRender = (props)=> [
    <StepOne     {...props}/>,
    <StepTwo    {...props}/>,
    <StepThree {...props}/>,
    <StepFour {...props}/>

]
steps = steps.map( (item,index)=> ({
    ...item,
    description: truncateWords(item.description, 350)
})); //truncate words 

console.log('===============step-componentsToRender---',steps)

export default function CreateImovelForm(props){
    const [values, setValues] = useState({
        activeStep: steps.filter((_,index)=>_.active && (index))
    })
    console.log('\n\n======value---',values)

    const handleChange= (prop)=>({target:{value=null}=null })=>{
        console.log('\n\n==========handle-change --=======',prop,value)
        setValues(oldValue=>({
            [prop]: values,
            ...oldValue
        }))
        // debugger
    }
    const handleCloseDialog = ()=>{

    }
    return (
        <Main className="create-imovel-component">
            <LeftSide className="left-side list-of-steps">
                <ul className="list-of-steps-body">
                    {steps.map( (item,index)=>(
                        <List key={index}>
                            <div className="icon-and-title" key={index}>
                                <span className="left-side-item-logo" key={index}>
                                    {item.active? <RightRadioSelected key={index}/> : <RightRadioNonSelected/> }
                                </span>
                                <span className="left-side-item-text" style={{color:!item.active && '#7f7f7f'}} key={index}>{item.title}</span>
                            </div>
                            <p className="left-side-item-description" key={index}>{item.description.substring(0,(item.description.length)/2  )}</p>
                        </List>
                    ))
                    }
                </ul> 
            </LeftSide>
            <CenterSide className="center-side">
                {
                    steps.map( (item,index)=> 
                        (componentsToRender({handleChange,item,index})[index]) 
                    )
                }
                <Box className="action-buttons">
                    <BackwardBtn className="backward-btn" onClick={handleBack}>Voltar</BackwardBtn>
                    <ForwardBtn className="forward-btn" onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Finalizar' : 'Continuar'}
                    </ForwardBtn>
                </Box>
            </CenterSide>
            <RightSide>
                <div style={{
                    padding: '2em'
                }}>

                    <Typography variant="h5" sx={{
                    fontFamily: 'gotham-medium'
                    }}>
                        Condições:
                    </Typography>
                    <Typography sx={{fontSize: '.7rem',lineHeight:2,fontFamily: 'gotham-light'}}>
                   
                        Os primeiros dois anúncios de particular são gratuitos para todos os tipos de imóvel desde terrenos, moradias, apartamentos, entre outros, até que o negócio seja concretizado.

                        Apenas será cobrado valores adicionais quando:

                        Esgotas os 2 anúncios gratuitos;
                        Publicas imóveis duplicados;
                        Divulgas uma propriedade para venda por mais de 1.000.000 KZS ou para arrendamento por mais de 10.000 KZS/mês;

                        <Typography variant="h6" sx={{
                            fontFamily: 'gotham-medium'
                        }}>
                            Dicas:
                        </Typography>
                        As fotografias são uma parte essencial para a concretização da venda ou arrendamento de um imóvel. Para garantires a melhor qualidade e assim um maior número de pedidos de visita, segue as dicas que preparámos para ti.
                    </Typography>
                </div>
            </RightSide>
        </Main>
    )
}




const StepOne = ({handleChange,...props})=>{
    const [haveTraits,setHaveTraits] = useState(false);
    const stepOneValidation = {
        
    }
    const handleFilterHouseTratis = (event)=>{
        // if (props == 'houseTraits')
        console.log('\n\n==========StepOne --=======',event,props)
        console.log('\n\n==========StepOne --=======',haveTraits)
        setHaveTraits(event.target.value)
        // debugger
    }

    return (
    <StepOneContainer>
     <Typography variant="h5" sx={{
        fontFamily: 'gotham-bold'
     }}>
        Editar imóvel - Dados básicos
     </Typography>
     <Form>
        <CustomDropdown
            name='house_type'
            property='Tipo de Imovel'
            width={80} 
            type="text"
            data={houseTraits}
            positionTop={9} 
            autoComplete={true}
            onSelect={(e)=>{
                handleFilterHouseTratis(e)
                handleChange('houseTraits')(e)
            }}
            debugger
            placeholder="Casas e apartamento"/>
        {
            haveTraits.traits 
                && haveTraits.traits?.values?.length > 0 && 
                <CustomDropdown
                    name='house_type_from_above'
                    property={haveTraits.traits.label}
                    width={80} 
                    type="text" 
                    autoComplete={true}
                    positionTop={14}
                    data={haveTraits.traits.values}
                    onSelect={handleChange('houseTraitType')}
                    debugger
                    placeholder="Apartamentos"/>
        }
        
        {
            !haveTraits?.onlyRent &&
            <Typography 
                sx={{
                    fontFamily: 'gotham-medium'
                }}>
                Tipo de Negócio
            </Typography>
        }

        {
        !haveTraits?.onlyRent?
            (<>
                <CheckBoxWithIcon  
                    title="Venda" 
                    description="Vivenda, Apartamentos, Terreno..." 
                    selected={true}
                    width={80}
                    icon={<HouseSolid/>}/>
                
                <CheckBoxWithIcon  
                    title="Arrendamento" 
                    description="Vivenda, Apartamentos,Terreno..." 
                    selected={false}
                    width={80}
                    icon={<HouseSolid/>}/>
        </>):
            (
                <CheckBoxWithIcon  
                title="Arrendamento" 
                description="Vivenda, Apartamentos,Terreno..." 
                selected={true}
                width={80}
                icon={<HouseSolid/>}/>

            )
        }

         

        <Typography 
        sx={{
            fontFamily: 'gotham-medium',
            marginTop: '1em'
        }}>
            Localização do imóvel
        </Typography>
        <GoogleMapDropdown
            leftIcon={<MapMarkerSolid/>}
            rightIcon={<Close/>}
            value=""
            type="text"
            positionTop={10}
            showTitle={false}
            autoComplete={true}
            width={80}
            property="Bairro" 
            name="full_address" 
            placeholder="Palanca ( Kilamba Kiaxi)"
        />
        <CustomInput 
            width={80}
            property="Rua" 
            name="street" 
            placeholder="Colocar o nome ou número da rua"/>
        <Split>
            
            <CustomInput 
                width={50}
                property="Numero da casa" 
                name="house_number" 
                placeholder="2..."/>
            <CustomInput 
                width={50}
                property="Códico postal" 
                name="zip_code" 
                placeholder="Opcional"/>
        </Split>
        
        
     </Form>

    </StepOneContainer>)
}
    
const StepTwo = (props)=>{
    return(
        <div>
            <StepOne></StepOne>
            <h3>we're in step two</h3>
        </div>
    )
}

const StepThree = (props)=>{

}

const StepFour = (props)=>{

}

const StepFive = (props)=>{

}

const StepSix = (props)=>{

}
