import React,{useState,useCallback,useEffect} from "react";
import styled from 'styled-components'
import RightRadioSelected from "@svg/right-radio-selected";
import RightRadioNonSelected from "@svg/right-radio-non-selected";
import './style.scss'
import { Box, Typography,Button } from "@mui/material";
import CustomInput from "../components/custom-input";
import CustomDropdown from "../components/custom-dropdown";
import CheckBoxWithIcon from "../components/checkbox-with-icon/checkbox-with-icon";
import { useDropzone } from 'react-dropzone';

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

const StepTwoContainer = styled.div`
padding: 2em 3em;
width: 100%;
`;

const StepsContainer = styled.div`
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

const HouseTypeFilter = styled.div`
        margin-left: 2em;
        margin-right: auto;
        margin-bottom: auto;
        margin-top: auto;
        flex-wrap: wrap;
        width: 90vw;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: scroll;
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
        &>*.btn-filter{
            padding: .9em 1em !important;
            color: #000;
            background-color: gray !important;
            border: none;
            border-radius: 1em;
            margin-right: 1em;
            margin-top: auto !important;
            margin-bottom: auto !important;
            &>*.selected{
                background-color: #000;
                color: #fff;
            }
            &:hover{
                transition: all ease-out .4s;
                background-color: #000;
                // color: #fff;
        }
}
`;


// Step four styling


const DropzoneBox = styled.div`
  border-radius: 1em;
  background: #f6f7f8;
  padding: 3em;
  text-align: center;
  cursor: pointer;
  border: 2px dashed #ddd;
  transition: border-color 0.3s;

  &:hover {
    border-color: #999;
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1em;
  margin-top: 1.5em;
`;

const PreviewItem = styled.div`
  position: relative;

  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 0.6em;
  }

  button {
    position: absolute;
    top: 6px;
    right: 6px;
    background: rgba(0,0,0,0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    cursor: pointer;
  }
`;

 // Step five styling 



const BillingToggle = styled.div`
  display: inline-flex;
  background: #f3f3f3;
  border-radius: 999px;
  padding: 0.4em;
  margin: 2em 0;

  button {
    border: none;
    background: transparent;
    padding: 0.6em 1.6em;
    border-radius: 999px;
    font-family: gotham-medium;
    cursor: pointer;
    color: #555;

    &.active {
      background: white;
      color: #000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2em;
  margin-top: 2em;
`;

const PlanCard = styled.div`
  background: #fff;
  border-radius: 1.2em;
  padding: 2em;
  border: 3px solid
    ${({ selected }) => (selected ? '#7B5CFF' : '#f1f1f1')};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

const Price = styled.div`
  font-size: 2rem;
  font-family: gotham-bold;
  margin: 1em 0;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6em;
  margin-top: 0.6em;
  font-size: 0.85rem;
`;






const OtherHouseTraits = styled.div``;

let steps = createImovelSteps

let componentsToRender = (props)=> [
    <StepOne     {...props}/>,
    <StepTwo    {...props}/>,
    <StepThree {...props}/>,
    <StepFour {...props}/>,
    <StepFive {...props}/>

]
steps = steps.map( (item,index)=> ({
    ...item,
    description: truncateWords(item.description, 350)
})); //truncate words 


const MAX_FILES = 40;
const MAX_SIZE = 32 * 1024 * 1024; // 32MB

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
    // useEffect(() => {
    //     if (values.houseType) {
    //     const trait = houseTraits.find(t => t.value === values.houseType);
    //     setSelectedTrait(trait || null);
    //     }
    // }, [values.houseType]);

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
    return (<StepTwoContainer>
        <StepOne {...props}/>
        <h3>Queremos saber mais sobre você (Seus dados)</h3>
        <CustomInput 
                width={50}
                property="Seu nome" 
                name="name" 
                placeholder="Opcional"
                onChange={(e)=>handleChange('name')(e.target.value)}
                />

        <CustomInput 
        width={50}
        property="Telefone para contato" 
        name="phone" 
        placeholder="Opcional"
        onChange={(e)=>handleChange('phone')(e.target.value)}
        />
    </StepTwoContainer>)
}

const StepThree = (props)=>{

    const [selectedTraits, setSelectedTraits] = useState([]);

    const toggleTrait = (trait) => {
    setSelectedTraits(prev =>
        prev.includes(trait)
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );

    handleChange('otherTraits')(
        selectedTraits.includes(trait)
        ? selectedTraits.filter(t => t !== trait)
        : [...selectedTraits, trait]
    );
    };


    return(<StepsContainer>
            <Typography variant="h5" sx={{
                fontFamily: 'gotham-bold'
            }}>
                Caracteristica do imóvel
            </Typography>
            <Box className="house_status">
                <h3>Estado do imovel</h3>
                <HouseTypeFilter className="availables-house-types">
                    {
                        houseTraits.map((item,index)=>(
                            <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>{item.label}</button>
                        ))
                    }
                </HouseTypeFilter>
            </Box>
            <Box className="imovel_types">
                <h3>Tipos de imóvel</h3>
                <HouseTypeFilter className="availables-house-types">
                    {
                        houseTraits.map((item,index)=>(
                            <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>{item.label}</button>
                        ))
                    }
                </HouseTypeFilter>
            </Box>
            <Box className="house_areas">
                <CustomInput 
                    width={50}
                    property="Area construida"
                    name="built_area" 
                    placeholder="Opcional"
                    onChange={(e)=>handleChange('builtArea')(e.target.value)}
                />
                <CustomInput 
                    width={50}
                    property="Area util"
                    name="usable_area" 
                    placeholder="Opcional"
                    onChange={(e)=>handleChange('usableArea')(e.target.value)}
                />
                <CustomInput 
                    width={50}
                    property="Area bruta" 
                    name="gross_area" 
                    placeholder="Opcional"
                    onChange={(e)=>handleChange('grossArea')(e.target.value)}
                />
                <CustomInput 
                    width={50}
                    property="Ano de construção" 
                    name="construction_year" 
                    placeholder="Opcional"
                    onChange={(e)=>handleChange('constructionYear')(e.target.value)}
                />
            </Box>
            <Box className="other_traits">
                    <h3>Outras características do teu imovel</h3>
                    <OtherHouseTraits>
                        {[1,2,3,3,3,3,3,3,3].map((_,index)=>
                        <CheckBoxWithIcon  
                            key={`${index}`}
                            title="Ar condicionado" 
                            description="Tem arcondicionado?" 
                            selected={true}
                            // onClick={() => toggleBusiness('venda')}
                            // selected={values.businessType === 'venda'}
                            width={20}
                            icon={<HouseSolid/>}
                        />)}
                    </OtherHouseTraits>
            </Box>
            <h3>Caracteristicas fisicas do imovel</h3>
            <Box className="house_physical_traits">
                <CustomInput 
                    width={50}
                    property="Quartos"
                    name="rooms" 
                    placeholder="Opcional"
                    onChange={(e)=>handleChange('rooms')(e.target.value)}
                />
                <CustomInput 
                    width={50}
                    property="Casas de banho"
                    name="bathrooms" 
                    placeholder="Opcional"
                    onChange={(e)=>handleChange('bathrooms')(e.target.value)}
                />
                <CustomInput 
                    width={50}
                    property="Preço do imovel" 
                    name="gross_area" 
                    placeholder="Opcional"
                    onChange={(e)=>handleChange('grossArea')(e.target.value)}
                />
                {/* <CustomInput 
                    width={50}
                    property="Tipo de aquecimento" 
                    name="heating_type" 
                    placeholder="Opcional"
                    onChange={(e)=>handleChange('heatingType')(e.target.value)}
                /> */}
            </Box>
            <h3>Coordernadas geograficas</h3>
            <Box className="house_areas">
                <CustomInput 
                    width={50}
                    property="Latitude"
                    name="latitude" 
                    placeholder="Opcional"
                    onChange={(e)=>handleChange('latitude')(e.target.value)}
                />
                <CustomInput 
                    width={50}
                    property="Longitude"
                    name="longitude" 
                    placeholder="Opcional"
                    onChange={(e)=>handleChange('usableArea')(e.target.value)}
                />
             
            </Box>
            <h3>Descriçao do anuncio</h3>
            <textarea></textarea>
        </StepsContainer>)

}



function StepFour({ values, handleChange }) {
  const [photos, setPhotos] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setPhotos(prev => {
      const combined = [...prev, ...acceptedFiles];
      return combined.slice(0, MAX_FILES);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.heic', '.webp', '.wbmp'],
    },
    maxSize: MAX_SIZE,
    multiple: true,
  });

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <StepsContainer>
      <Typography variant="h5" sx={{ fontFamily: 'gotham-bold', mb: 2 }}>
        Editar imóvel - Multimédia
      </Typography>

      {/* ============================
         Photos
      ============================ */}

      <Typography variant="h6">Fotos</Typography>
      <Typography sx={{ fontSize: '.9rem', color: '#666', mb: 2 }}>
        Aqui podes inserir as tuas primeiras fotos, escolher a foto principal,
        arrastar para ordenar e identificar as tuas fotos
      </Typography>

      <DropzoneBox {...getRootProps()}>
        <input {...getInputProps()} />
        <Typography variant="h6">
          {isDragActive ? 'Soltar fotos aqui' : 'Largar fotos aqui'}
        </Typography>
      </DropzoneBox>

      <Typography sx={{ fontSize: '.8rem', color: '#666', mt: 1 }}>
        {photos.length} / {MAX_FILES} fotos • até 32MB cada
      </Typography>

      {photos.length > 0 && (
        <PreviewGrid>
          {photos.map((file, index) => (
            <PreviewItem key={index}>
              <img src={URL.createObjectURL(file)} alt="preview" />
              <button onClick={() => removePhoto(index)}>×</button>
            </PreviewItem>
          ))}
        </PreviewGrid>
      )}

      <Button
        sx={{ mt: 2, borderRadius: '1em' }}
        variant="contained"
        onClick={() => document.querySelector('input[type=file]').click()}
      >
        Adicionar foto
      </Button>

      {/* ============================
         License
      ============================ */}

      <Box mt={4}>
        <Typography variant="h6">
          Licença de corrector / imobiliária
        </Typography>

        <CustomInput
          value={values.licenseId || ''}
          CustomInput 
          width={50}
          property="Adicionar o id da sua licença aqui"
          name="licenseId" 
          placeholder="Adicionar o id da sua licença aqui"
          onChange={(e) => handleChange('licenseId')(e.target.value)}
        />
      </Box>

      {/* ============================
         Videos
      ============================ */}

      <Box mt={4}>
        <Typography variant="h6">Vídeos</Typography>
        <Typography sx={{ fontSize: '.9rem', color: '#666', mb: 1 }}>
          Aqui podes introduzir os links para os vídeos carregados no Youtube
        </Typography>

        <CustomInput
          placeholder="https://www.youtube.com/watch?v=..."
          value={values.videoUrl || ''}
          onChange={(e) => handleChange('videoUrl')(e.target.value)}
        />
      </Box>
    </StepsContainer>
  );
}




function StepFive({ values, handleChange }) {
  const [billing, setBilling] = useState('anual');

  const plans = PLANS[billing];

  const selectPlan = (plan) => {
    handleChange('plan')({
      id: plan.id,
      billing,
      price: plan.price,
    });
  };

  return (
    <StepsContainer>
      <Typography variant="h4" sx={{ fontFamily: 'gotham-bold' }}>
        Planos para este anúncio
      </Typography>

      <Typography sx={{ mt: 1, color: '#666' }}>
        Escolha um de nossos planos profissional
      </Typography>

      {/* Billing toggle */}
      <BillingToggle>
        <button
          className={billing === 'anual' ? 'active' : ''}
          onClick={() => setBilling('anual')}
        >
          Anual (30% desconto)
        </button>
        <button
          className={billing === 'mensal' ? 'active' : ''}
          onClick={() => setBilling('mensal')}
        >
          Mensal
        </button>
      </BillingToggle>

      {/* Plans */}
      <PlansGrid>
        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            selected={values.plan?.id === plan.id}
            onClick={() => selectPlan(plan)}
          >
            <Typography variant="h6">{plan.title}</Typography>

            {plan.label && (
              <Typography sx={{ mt: 1, fontWeight: 600 }}>
                {plan.label}
              </Typography>
            )}

            {plan.price > 0 && (
              <Price>
                {plan.price.toLocaleString()} {plan.currency}
                <div style={{ fontSize: '0.8rem' }}>Por mês</div>
              </Price>
            )}

            {plan.subtitle && (
              <Typography sx={{ fontSize: '0.85rem', mt: 1 }}>
                {plan.subtitle}
              </Typography>
            )}

            {/* Features */}
            <Box mt={2}>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Feature key={i}>
                    ✓ Renovação automática
                  </Feature>
                ))}
            </Box>

            <Box
              mt={2}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Feature>✓ Renovação automática</Feature>
              <Feature>✓ Cancele a qualquer momento</Feature>
            </Box>
          </PlanCard>
        ))}
      </PlansGrid>

      <Typography sx={{ mt: 4, fontSize: '0.85rem', color: '#777' }}>
        Receberá um email e uma mensagem normal de validação do seu imóvel.
        <br />
        Favor confirmar para tornar seu imóvel público.
      </Typography>
    </StepsContainer>
  );
}


const PLANS = {
  mensal: [
    {
      id: 'basic',
      title: 'Basico',
      price: 0,
      currency: 'Kz',
      label: 'Grátis',
      subtitle: 'Máximo 3 anúncios',
      highlighted: true,
    },
    {
      id: 'professional',
      title: 'Profissional',
      price: 25000,
      currency: 'Kz',
    },
    {
      id: 'premium',
      title: 'Premium',
      price: 15000,
      currency: 'Kz',
    },
  ],
  anual: [
    {
      id: 'basic',
      title: 'Basico',
      price: 0,
      currency: 'Kz',
      label: 'Grátis',
      subtitle: 'Máximo 3 anúncios',
      highlighted: true,
    },
    {
      id: 'professional',
      title: 'Profissional',
      price: 17500, // 30% desconto
      currency: 'Kz',
    },
    {
      id: 'premium',
      title: 'Premium',
      price: 10500,
      currency: 'Kz',
    },
  ],
};
