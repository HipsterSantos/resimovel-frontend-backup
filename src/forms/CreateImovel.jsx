import React,{useState,useCallback,useEffect} from "react";
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client';
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
import { setCreateImovelStep, updateCreateImovel, useStore } from '../contexts/states.store.context';
import Logger from "../helpers/logging";
import { 
  validateField, 
  validateForm, 
  isFormValid, 
  ValidationRules,
  CommonValidationSchemas 
} from '../helpers/validation';



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

// Step three styling

const StatusWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8em;
  margin-top: 1em;
`;

const StatusPill = styled.button`
  padding: 0.6em 1.4em;
  border-radius: 0.7em;
  border: none;
  font-family: gotham-medium;
  font-size: 0.85rem;
  cursor: pointer;

  background: ${({ active }) => (active ? '#6B8CF7' : '#f3f4f6')};
  color: ${({ active }) => (active ? '#fff' : '#111')};

  transition: all 0.25s ease;

  &:hover {
    background: ${({ active }) => (active ? '#5a7be0' : '#e6e7eb')};
  }
`;

const TraitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2em;
  margin-top: 1.2em;
`;

const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.4em;
  margin-top: 1.2em;
`;

const DescriptionBox = styled.textarea`
  width: 100%;
  min-height: 140px;
  margin-top: 1em;
  padding: 1em;
  border-radius: 0.8em;
  border: none;
  background: #f7f8fa;
  resize: vertical;
  font-family: gotham-light;
`;


// =================================

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

const PUBLISH_HOUSE_MUTATION = gql`
  mutation PublishHouse($housePayload: HouseInput!) {
    publishHouse(housePayload: $housePayload) {
      id
      title
      photos
      videoUrl
      licenseId
    }
  }
`;

const log = new Logger('CreateImovelForm');

console.log('===============step-componentsToRender---',steps)

export default function CreateImovelForm(props){
    
    const { state, dispatch } = useStore();
    const formValues = state.createImovelDraft;
    const activeStep = formValues.step;
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [publishHouse] = useMutation(PUBLISH_HOUSE_MUTATION);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8989';

    const handleChange = (field) => (value) => {
        dispatch(updateCreateImovel({ [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
    };

    const uploadSinglePhoto = useCallback(async (file) => {
      log.info('Uploading photo', {
        name: file?.name,
        sizeBytes: file?.size,
        type: file?.type,
      });
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch(`${apiBaseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || 'Falha no upload da foto');
      }

      const payload = await response.json();
      if (!payload?.url) {
        throw new Error('Resposta inválida no upload da foto');
      }
      log.success('Photo uploaded', {
        name: file?.name,
        url: payload.url,
      });
      return payload.url;
    }, [apiBaseUrl]);

    const uploadPhotos = useCallback(async (photos = []) => {
      const filePhotos = photos.filter((photo) => photo instanceof File);
      if (!filePhotos.length) {
        log.info('No local photos to upload in step 5');
        return [];
      }

      log.info('Uploading photos batch', {
        totalFiles: filePhotos.length,
      });

      const uploaded = [];
      for (const file of filePhotos) {
        const url = await uploadSinglePhoto(file);
        uploaded.push(url);
      }
      log.success('Photos batch uploaded', {
        uploadedCount: uploaded.length,
      });
      return uploaded;
    }, [uploadSinglePhoto]);

    const buildHousePayload = useCallback((values, uploadedPhotoUrls = []) => {
      const normalizedType =
        values.type ||
        values.houseType?.label ||
        values.houseType?.value ||
        values.houseType ||
        'Imóvel';

      const existingPhotoUrls = (values.photos || []).filter((photo) => typeof photo === 'string');
      const photos = [...existingPhotoUrls, ...uploadedPhotoUrls];

      return {
        type: normalizedType,
        houseType: normalizedType,
        serviceType: values.businessType === 'venda' ? 'Venda' : 'Aluguel',
        businessType: values.businessType || 'venda',
        title: values.title || `${normalizedType} em ${values.fullAddress || 'Angola'}`,
        price: values.price ? Number(values.price) : 0,
        description: values.description || '',
        fullAddress: values.fullAddress || '',
        status: values.houseStatus || [],
        houseStatus: values.houseStatus || [],
        otherTraits: values.otherTraits || [],
        typology: values.houseTraitType?.label || values.houseTraitType?.value || values.houseTraitType || '',
        rooms: values.rooms ? Number(values.rooms) : undefined,
        bathrooms: values.bathrooms ? Number(values.bathrooms) : undefined,
        builtArea: values.builtArea ? Number(values.builtArea) : undefined,
        usableArea: values.usableArea ? Number(values.usableArea) : undefined,
        grossArea: values.grossArea ? Number(values.grossArea) : undefined,
        constructionYear: values.constructionYear ? Number(values.constructionYear) : undefined,
        houseNumber: values.houseNumber || '',
        street: values.street || '',
        city: values.city || '',
        neighborhood: values.neighborhood || '',
        latitude: values.latitude ? Number(values.latitude) : undefined,
        longitude: values.longitude ? Number(values.longitude) : undefined,
        location: values.location?.lat && values.location?.lng
          ? { lat: Number(values.location.lat), lng: Number(values.location.lng) }
          : undefined,
        photos,
        videoUrl: values.videoUrl || '',
        licenseId: values.licenseId || '',
      };
    }, []);

    const submitHouse = useCallback(async () => {
      setSubmitError('');
      setIsSubmitting(true);
      log.info('Step 5 submit started', {
        step: formValues.step,
        selectedPlan: formValues.plan?.id || null,
        localPhotos: (formValues.photos || []).filter((photo) => photo instanceof File).length,
        existingPhotos: (formValues.photos || []).filter((photo) => typeof photo === 'string').length,
      });
      try {
        const uploadedPhotoUrls = await uploadPhotos(formValues.photos || []);
        const housePayload = buildHousePayload(formValues, uploadedPhotoUrls);
        log.debug('Publishing house payload summary', {
          title: housePayload.title,
          businessType: housePayload.businessType,
          photos: housePayload.photos?.length || 0,
          hasVideoUrl: !!housePayload.videoUrl,
          hasLicenseId: !!housePayload.licenseId,
        });

        await publishHouse({
          variables: { housePayload },
        });

        dispatch(updateCreateImovel({ photos: housePayload.photos }));
        log.success('Step 5 submit completed', {
          photos: housePayload.photos?.length || 0,
        });
        window.alert('Imóvel publicado com sucesso.');
      } catch (error) {
        log.error('Step 5 submit failed', {
          error: error?.message || String(error),
        });
        setSubmitError(error.message || 'Falha ao publicar imóvel');
      } finally {
        setIsSubmitting(false);
      }
    }, [buildHousePayload, dispatch, formValues, publishHouse, uploadPhotos]);

    // Validation schemas for each step
    const stepValidationSchemas = {
      0: { // Step 1 - Basic info
        houseType: {
          rules: [ValidationRules.required],
          label: 'Tipo de Imóvel',
        },
        businessType: {
          rules: [ValidationRules.required],
          label: 'Tipo de Negócio',
        },
        fullAddress: {
          rules: [ValidationRules.required],
          label: 'Localização do Imóvel',
        },
        street: {
          rules: [ValidationRules.required],
          label: 'Rua',
        },
        houseNumber: {
          rules: [ValidationRules.required, ValidationRules.number],
          label: 'Número da Casa',
        },
        zipCode: {
          rules: [ValidationRules.required, ValidationRules.zipCode],
          label: 'Código Postal',
        },
      },
      1: { // Step 2 - About you (reloads step 1 + adds name/phone)
        houseType: {
          rules: [ValidationRules.required],
          label: 'Tipo de Imóvel',
        },
        businessType: {
          rules: [ValidationRules.required],
          label: 'Tipo de Negócio',
        },
        fullAddress: {
          rules: [ValidationRules.required],
          label: 'Localização do Imóvel',
        },
        name: {
          rules: [ValidationRules.required, ValidationRules.minLength(3)],
          label: 'Seu Nome',
        },
        phone: {
          rules: [ValidationRules.required, ValidationRules.phoneDigitsOnly, ValidationRules.maxLength(13)],
          label: 'Telefone para Contato',
        },
      },
      2: { // Step 3 - Property details (mostly optional)
        // Optional field validation
      },
      3: { // Step 4 - Media (optional)
        videoUrl: {
          rules: [ValidationRules.url],
          label: 'URL do Vídeo',
          optional: true,
        },
      },
      4: { // Step 5 - Plans (no validation needed)
      },
    };

    const validateCurrentStep = () => {
      const schema = stepValidationSchemas[activeStep];
      if (!schema) return true;

      const stepErrors = validateForm(formValues, schema);
      setErrors(stepErrors);
      return isFormValid(stepErrors);
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
          if (formValues.step === steps.length - 1) {
            submitHouse();
            return;
          }
          if (formValues.step < steps.length - 1) {
            dispatch(setCreateImovelStep(formValues.step + 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
    };

    const handleBack = () => {
        if (formValues.step > 0) {
            dispatch(setCreateImovelStep(formValues.step - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        console.log('createImovelDraft updated:', formValues, state);
    }, [formValues]);
  
    return (
        <Main className="create-imovel-component">
            <LeftSide className="left-side list-of-steps">
                <ul className="list-of-steps-body">
                    {steps.map( (item,index)=>(
                        <List key={index}>
                            <div className="icon-and-title" key={index}>
                                <span className="left-side-item-logo" key={index}>
                                    {index === activeStep ? <RightRadioSelected /> : <RightRadioNonSelected />}

                                </span>
                                <span className="left-side-item-text" style={{color:index !== activeStep && '#7f7f7f'}} key={index}>{item.title}</span>
                            </div>
                            <p className="left-side-item-description" key={index}>{item.description.substring(0,(item.description.length)/2  )}</p>
                        </List>
                    ))
                    }
                </ul> 
            </LeftSide>
            <CenterSide className="center-side">
                {
                    <div key={`step-${activeStep}-inner-component`}>
                        {componentsToRender({values: formValues, handleChange, errors, submitError, isSubmitting})[activeStep]}
                    </div>
                }
                <Box className="action-buttons">
                    <BackwardBtn className={"backward-btn " + (activeStep==0?' cursor-disabled':'')} disabled={activeStep === 0}  onClick={handleBack}>
                        Voltar
                    </BackwardBtn>
                    <ForwardBtn className="forward-btn" onClick={handleNext} disabled={isSubmitting}>
                      {activeStep === steps.length - 1 ? (isSubmitting ? 'Publicando...' : 'Publicar Imóvel') : 'Continuar'}
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




const StepOne = ({values, handleChange, errors = {},...props})=>{

    const selectedHouseType = values.houseType;

    const traitsConfig = selectedHouseType?.traits ?? null;
    const onlyRent = selectedHouseType?.onlyRent ?? false;
    
    const toggleBusiness = (type) => {
        handleChange('businessType')(
        values.businessType === type ? null : type
        );
    };

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
            value={values.houseType}
            property='Tipo de Imovel'
            width={80} 
            type="text"
            data={houseTraits}
            positionTop={9} 
            autoComplete={true}
            onSelect={(item) => handleChange('houseType')(item)}
            debugger
            placeholder="Casas e apartamento"
            error={!!errors.houseType}
            helperText={errors.houseType}
            required={true}
        />
        {
            traitsConfig?.values?.length> 0 && 
                <CustomDropdown
                    name='house_traits_type'
                    value={values.houseTraitType}
                    property={traitsConfig.label}
                    width={80} 
                    type="text" 
                    autoComplete={true}
                    positionTop={14}
                    data={traitsConfig.values}
                    onSelect={(item) =>
                        handleChange('houseTraitType')(item)
                    }
                    debugger
                    placeholder="Apartamentos"/>
        }
        
        {
            !onlyRent &&
            <Typography 
                sx={{
                    fontFamily: 'gotham-medium'
                }}>
                Tipo de Negócio
            </Typography>
        }

        {
        !onlyRent?
            (<>
                <CheckBoxWithIcon  
                    title="Venda" 
                    description="Vivenda, Apartamentos, Terreno..." 
                    selected={values.businessType === 'venda'}
                    onClick={() => toggleBusiness('venda')}
                    width={80}
                    icon={<HouseSolid/>}
                    />
                
                <CheckBoxWithIcon  
                    title="Arrendamento" 
                    description="Vivenda, Apartamentos,Terreno..." 
                    selected={values.businessType === 'arrendamento'}
                    onClick={() => toggleBusiness('arrendamento')}
                    width={80}
                    icon={<HouseSolid/>}/>
        </>):
            (
                <CheckBoxWithIcon  
                    title="Arrendamento" 
                    description="Quartos para arrendar" 
                    selected={values.businessType === 'arrendamento'}
                    onClick={() => toggleBusiness('arrendamento')}
                    width={80}
                    icon={<HouseSolid/>}
                />

            )
        }
        {errors.businessType && (
          <Typography sx={{ fontSize: '0.75rem', color: '#FF6B6B', textIndent: '0.4em' }}>
            {errors.businessType}
          </Typography>
        )}

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
            value={values.fullAddress || ''}
            type="text"
            positionTop={10}
            showTitle={false}
            autoComplete={true}
            width={80}
            property="Bairro"
            placeholder="Palanca ( Kilamba Kiaxi)"
            error={!!errors.fullAddress}
            helperText={errors.fullAddress}
            required={true}
            name="full_address" 
            onSelect={(place) => {
                handleChange('fullAddress')(place.description || place.target.value?.description);
                handleChange('location')({
                lat: place.geometry?.location?.lat?.() || place.geometry?.location?.lat,
                lng: place.geometry?.location?.lng?.() || place.geometry?.location?.lng,
                });
          }}
        />
        <CustomInput 
          width={80}
          property="Rua" 
          name="street" 
          placeholder="Colocar o nome ou número da rua"
          value={values.street || ''}
          onChange={(e)=>handleChange('street')(e.target.value)}
          error={!!errors.street}
          helperText={errors.street}
        />
        <Split>
          <CustomInput 
            width={50}
            property="Numero da casa" 
            name="house_number" 
            placeholder="2..."
            value={values.houseNumber || ''}
            onChange={(e)=> {
              const val = e.target.value.replace(/\D/g, '');
              handleChange('houseNumber')(val);
            }}
            error={!!errors.houseNumber}
            helperText={errors.houseNumber}
          />
            <CustomInput 
                width={50}
                property="Códico postal" 
                name="zip_code" 
                placeholder="0000 ou 0000-00"
                value={values.zipCode || '0000-00'}
                onChange={(e)=> {
                  let val = e.target.value.replace(/\D/g, '');
                  if(val.length > 4) val = val.slice(0,4) + '-' + val.slice(4,6);
                  // If empty, set default
                  if (!val) val = '0000-00';
                  handleChange('zipCode')(val);
                }}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
            />
        </Split>
        
        
     </Form>

    </StepOneContainer>)
}
    
const StepTwo = ({values, handleChange, errors = {}})=>{
    return (<StepTwoContainer>
        {/* Reload Step 1 fields */}
        <StepOne values={values} handleChange={handleChange} errors={errors}/>
        
        {/* Additional fields for Step 2 */}
        <Typography variant="h5" sx={{
            fontFamily: 'gotham-bold',
            marginTop: '2em'
        }}>
            Confirmação de contacto
        </Typography>

        {values.fullAddress && (
            <Box sx={{
                backgroundColor: '#f7f8fa',
                padding: '1em',
                borderRadius: '0.8em',
                marginTop: '1em',
                marginBottom: '1em'
            }}>
                <Typography variant="body2" sx={{ fontFamily: 'gotham-medium', color: '#333' }}>
                    Localização confirmada:
                </Typography>
                <Typography sx={{ fontSize: '.9rem', color: '#666', marginTop: '0.5em' }}>
                    {values.fullAddress}
                </Typography>
            </Box>
        )}

        <Typography 
            sx={{
                fontFamily: 'gotham-medium',
                marginTop: '2em',
                marginBottom: '1em'
            }}
        >
            Queremos saber mais sobre você (Seus dados)
        </Typography>

        <CustomInput 
            width={80}
            property="Seu nome" 
            name="name" 
            placeholder="Digite seu nome completo"
            value={values.name || ''}
            onChange={(e)=>handleChange('name')(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
        />

        <CustomInput 
            width={80}
            property="Telefone para contato" 
            name="phone" 
            placeholder="Ex: 923456789 ou +244923456789"
            value={values.phone || ''}
            onChange={(e)=>handleChange('phone')(e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
        />
    </StepTwoContainer>)
}

const StepThree = ({values, handleChange, errors = {}})=>{
  const houseStatus = values.houseStatus || [];
  const otherTraits = values.otherTraits || [];
  
  const toggleStatus = (status) => {
    const next = houseStatus.includes(status)
      ? houseStatus.filter(s => s !== status)
      : [...houseStatus, status];

    handleChange('houseStatus')(next);
  };

  const toggleTrait = (trait) => {
    const next = otherTraits.includes(trait)
      ? otherTraits.filter(t => t !== trait)
      : [...otherTraits, trait];

    handleChange('otherTraits')(next);
  };
  

    return(<StepsContainer>
            <Typography variant="h5" sx={{
                fontFamily: 'gotham-bold'
            }}>
                Caracteristica do imóvel
            </Typography>
            <Box className="house_status">
                <h3>Estado do imovel</h3>
                <StatusWrapper>
                {[
                    'Novo',
                    'Usado',
                    'Em construção',
                    'Renovado',
                    'Para demolir/reconstruir',
                    'Recuperado',
                    'Por recuperar',
                    'Com programa de reabilitação',
                ].map(status => (
                    <StatusPill
                        key={status}
                        active={houseStatus.includes(status)}
                        onClick={() => toggleStatus(status)}
                    >
                    {status}
                    </StatusPill>
                ))
                }
                </StatusWrapper>
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
            <InputsGrid className="house_areas">
                <CustomInput 
                    width={50}
                    property="Area construida"
                    name="built_area" 
                    placeholder="Opcional"
                    value={values.builtArea || ''}
                    onChange={(e)=>handleChange('builtArea')(e.target.value)}
                    error={!!errors.builtArea}
                    helperText={errors.builtArea}
                />
                <CustomInput 
                    width={50}
                    property="Area util"
                    name="usable_area" 
                    placeholder="Opcional"
                    value={values.usableArea || ''}
                    onChange={(e)=>handleChange('usableArea')(e.target.value)}
                    error={!!errors.usableArea}
                    helperText={errors.usableArea}
                />
                <CustomInput 
                    width={50}
                    property="Area bruta" 
                    name="gross_area" 
                    placeholder="Opcional"
                    value={values.grossArea || ''}
                    onChange={(e)=>handleChange('grossArea')(e.target.value)}
                    error={!!errors.grossArea}
                    helperText={errors.grossArea}
                />
                <CustomInput 
                    width={50}
                    property="Ano de construção" 
                    name="construction_year" 
                    placeholder="Opcional"
                    value={values.constructionYear || ''}
                    onChange={(e)=>handleChange('constructionYear')(e.target.value)}
                    error={!!errors.constructionYear}
                    helperText={errors.constructionYear}
                />
            </InputsGrid>
            <Box className="other_traits">
                    <h3>Outras características do teu imóvel</h3>
                    <TraitsGrid>
                        {[
                            'Ar condicionado',
                            'Elevador',
                            'Garagem',
                            'Varanda',
                            'Piscina',
                            'Jardim',
                            'Segurança',
                            'Ginásio',
                            'Vista mar',
                        ].map(trait => (
                            <CheckBoxWithIcon
                                key={trait}
                                title={trait}
                                description="Dá o melhor conforto ao seu cliente"
                                selected={otherTraits.includes(trait)}
                                onClick={() => toggleTrait(trait)}
                                width={100}
                                icon={<HouseSolid />}
                            />
                        ))}
                    </TraitsGrid>

            </Box>
            <h3>Caracteristicas fisicas do imovel</h3>
            <InputsGrid className="house_physical_traits">
                <CustomInput 
                    width={50}
                    property="Quartos"
                    name="rooms" 
                    placeholder="Opcional"
                    value={values.rooms || ''}
                    onChange={(e)=>handleChange('rooms')(e.target.value)}
                    error={!!errors.rooms}
                    helperText={errors.rooms}
                />
                <CustomInput 
                    width={50}
                    property="Casas de banho"
                    name="bathrooms" 
                    placeholder="Opcional"
                    value={values.bathrooms || ''}
                    onChange={(e)=>handleChange('bathrooms')(e.target.value)}
                    error={!!errors.bathrooms}
                    helperText={errors.bathrooms}
                />
                <CustomInput 
                    width={50}
                    property="Preço do imovel" 
                    name="price" 
                    placeholder="Opcional"
                    value={values.price || ''}
                    onChange={(e)=>handleChange('price')(e.target.value)}
                    error={!!errors.price}
                    helperText={errors.price}
                />
            </InputsGrid>
            <h3>Coordernadas geograficas</h3>
            <InputsGrid className="house_areas">
                <CustomInput 
                    width={50}
                    property="Latitude"
                    name="latitude" 
                    placeholder="Opcional"
                    value={values.latitude || ''}
                    onChange={(e)=>handleChange('latitude')(e.target.value)}
                />
                <CustomInput 
                    width={50}
                    property="Longitude"
                    name="longitude" 
                    placeholder="Opcional"
                    value={values.longitude || ''}
                    onChange={(e)=>handleChange('longitude')(e.target.value)}
                />
             
            </InputsGrid>
            <h3>Descrição do anúncio</h3>
            <DescriptionBox
                value={values.description || ''}
                onChange={(e) => handleChange('description')(e.target.value)}
                placeholder="Descreva o seu imóvel..."
            />

        </StepsContainer>)

}



function StepFour({ values, handleChange, errors = {} }) {
  const [photos, setPhotos] = useState(values.photos || []);

  useEffect(() => {
    setPhotos(values.photos || []);
  }, [values.photos]);

  const onDrop = useCallback((acceptedFiles) => {
    setPhotos(prev => {
      const combined = [...prev, ...acceptedFiles].slice(0, MAX_FILES);
      handleChange('photos')(combined);
      return combined.slice(0, MAX_FILES);
    });
  }, [handleChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.heic', '.webp', '.wbmp'],
    },
    maxSize: MAX_SIZE,
    multiple: true,
  });

  const removePhoto = (index) => {
  setPhotos(prev => {
    const nextPhotos = prev.filter((_, i) => i !== index);
    handleChange('photos')(nextPhotos);
    return nextPhotos;
  });
};

  console.log('\n\n\n\n\n\n\n\n\n\n\n=================photos in step 4', photos)
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
              <img
                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                alt="preview"
              />
              <button type="button" onClick={() => removePhoto(index)}>×</button>
            </PreviewItem>
          ))}
        </PreviewGrid>
      )}

      <Button
        sx={{ mt: 2, borderRadius: '1em' }}
        variant="contained"
        onClick={() => document.querySelector('input[type=file]')?.click()}
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
          width={80}
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
          width={80}
          placeholder="https://www.youtube.com/watch?v=..."
          property="URL do vídeo"
          value={values.videoUrl || ''}
          onChange={(e) => handleChange('videoUrl')(e.target.value)}
          error={!!errors.videoUrl}
          helperText={errors.videoUrl}
        />
      </Box>
    </StepsContainer>
  );
}




function StepFive({ values, handleChange, errors = {}, submitError, isSubmitting }) {
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
          type="button"
          className={billing === 'anual' ? 'active' : ''}
          onClick={() => setBilling('anual')}
        >
          Anual (30% desconto)
        </button>
        <button
          type="button"
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
      {submitError && (
        <Typography sx={{ mt: 2, fontSize: '0.9rem', color: '#d32f2f' }}>
          {submitError}
        </Typography>
      )}
      {isSubmitting && (
        <Typography sx={{ mt: 1, fontSize: '0.85rem', color: '#666' }}>
          Enviando fotos e publicando anúncio...
        </Typography>
      )}
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
  ]
}
