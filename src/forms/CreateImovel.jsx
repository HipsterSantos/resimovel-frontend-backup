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
display: flex;
flex-direction: column;
height: 100vh;
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

&.cursor-disabled{
    cursor: not-allowed;
    opacity: .5;
}
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
        activeStep: steps.filter((_,index)=>_.active ).keys().next().value
    })
    console.log('\n\n======value---',values)
    console.log('\n\n======value---',steps.filter((_,index)=>_.active && (index)))

    // Centralized form state for ALL steps
  const [formValues, setFormValues] = useState({
    houseType: null,
    houseTraitType: null,
    businessType: 'venda',          // "venda" | "arrendamento" | null (single value)
    fullAddress: '',
    street: '',
    houseNumber: '',
    zipCode: '',
    phone: '',
    name:'',    
    notifyMeThrough:null,
    // Add fields for future steps here (photos, price, description, etc.)
  });

//   const handleChange = (field) => (value) => {
//     setFormValues(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

    const handleChange = (field) => (value) => {
        // debugger
        setFormValues(prev => ({ ...prev, [field]: value }));
        console.log(`Field ${field} updated to:`, value);
        console.log(`Forms value ${field} updated to:`, formValues);
    };
    const handleCloseDialog = ()=>{

    }

    const handleNext = ()=>{
        const currentActiveIndex = steps.findIndex(_=>_.active)
        if(currentActiveIndex < steps.length - 1){
            steps[currentActiveIndex].active = false;
            steps[currentActiveIndex + 1].active = true;
            setValues(oldValue=>({
                ...oldValue,
                activeStep: currentActiveIndex + 1
            }))
        }
    }

    const handleBack = ()=>{
        const currentActiveIndex = steps.findIndex(_=>_.active)
        if(currentActiveIndex > 0){
            steps[currentActiveIndex].active = false;
            steps[currentActiveIndex - 1].active = true;
            setValues(oldValue=>({
                ...oldValue,
                activeStep: currentActiveIndex - 1
            }))
            console.log('===active step ', values.activeStep)
        }
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
                        index === values.activeStep && ( <div key={`${item}-${index}`}>
                            {componentsToRender({values:formValues,handleChange,item,index})[index]} 
                        </div>
                    )
                    )
                }
                <Box className="action-buttons">
                    <BackwardBtn className={"backward-btn " + (values.activeStep==0?' cursor-disabled':'')} disabled={values.activeStep === 0}  onClick={handleBack}>Voltar</BackwardBtn>
                    <ForwardBtn className="forward-btn" onClick={handleNext}>Continuar</ForwardBtn>
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




const StepOne = ({values,handleChange,...props})=>{
    const [haveTraits,setHaveTraits] = useState(false);
    const stepOneValidation = {
        
    }

    const [selectedTrait, setSelectedTrait] = useState(null);

    // Local errors (optional – can be passed from parent or managed here)
    const [localErrors, setLocalErrors] = useState({});

    // Sync local state with parent's selected trait
    useEffect(() => {
        if (values.houseType) {
        const trait = houseTraits.find(t => t.value === values.houseType);
        setSelectedTrait(trait || null);
        }
    }, [values.houseType]);

    // Toggle business type (mutually exclusive)
    const toggleBusiness = (type) => {
        handleChange('businessType')(values.businessType === type ? null : type);
    };

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
            placeholder="Casas e apartamento"
            error={!!localErrors.houseType}
            helperText={localErrors.houseType}
            />
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
                    // selected={true}
                    onClick={() => toggleBusiness('venda')}
                    selected={values.businessType === 'venda'}
                    width={80}
                    icon={<HouseSolid/>}
                    />
                
                <CheckBoxWithIcon  
                    title="Arrendamento" 
                    description="Vivenda, Apartamentos,Terreno..." 
                    onClick={() => toggleBusiness('arrendamento')}
                    selected={values.businessType === 'arrendamento'}
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
            onSelect={handleChange('fullAddress')}
        />
        <CustomInput 
            width={80}
            property="Rua" 
            name="street" 
            placeholder="Colocar o nome ou número da rua"
            onChange={(e)=>handleChange('street')(e.target.value)}
            />
        <Split>
            
            <CustomInput 
                width={50}
                property="Numero da casa" 
                name="house_number" 
                placeholder="2..."
                onChange={(e)=>handleChange('houseNumber')(e.target.value)}
                />
            <CustomInput 
                width={50}
                property="Códico postal" 
                name="zip_code" 
                placeholder="Opcional"
                onChange={(e)=>handleChange('zipCode')(e.target.value)}
                />
        </Split>
        
        
     </Form>

    </StepOneContainer>)
}
    
const StepTwo = (props)=>{

}

const StepThree = (props)=>{

}

const StepFour = (props)=>{

}

const StepFive = (props)=>{

}

const StepSix = (props)=>{

}
