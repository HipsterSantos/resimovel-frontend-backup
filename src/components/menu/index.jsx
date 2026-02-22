import React,{useState,useEffect, useContext,useRef} from 'react'
// import {useHistory} from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import styled from 'styled-components'
import Button from '@mui/material/Button';
import ResimovelLogo from '@svg/resimove.logo'
import Carret from '@svg/carret'
import { menus } from '../../helpers/menus'
import './style.scss'
import FullScreenDialog from '../FullScreenDialog';
import LoginForm from '../../forms/Login.form';
import OnBoardingForm from '../../forms/Onboarding.login.signup';
import SignupForm from '../../forms/Signup.form';
import CreateImovelForm from '../../forms/CreateImovel';
import Avatar from '../../../public/svg/circle-avatar';

import Close from '../../../public/svg/close';
import { MenuIcon } from '../../../public/svg/menu-icon';
import { useStore } from '../../contexts/states.store.context';
import { toast } from 'react-toastify';
import PasswordRecoverForm from '../../forms/Password.recover';
import { useNavigate } from 'react-router-dom';


const NavContainer = styled.nav`    
    display:flex;
    
    //Smaller screens
    @media only screen and (max-width: 767px){
        flex-direction: column;
        // background: red;
    }
    
    //Small screens and Tablet
    @media only screen and (min-width:768px) and (max-width: 1023px){
        
        flex-direction: column;
    }

    //desktop screens
    @media only screen and (min-width:1024px ){
        // z-ickndex: 10000;
        width: inherit;
    }
    // larger screens 
    @media only screen and (min-width: 1200px){

    }

    `
const ContainerBoxs  = styled.div`
    display:flex;
    width: 100%;
    //desktop and so on 
    @media only screen and (min-width: 1024px){
        margin-right: 1em;
        margin-left: auto;
    }
    @media only screen and (max-width: 767px){
        position: absolute;
        /* margin-right: 1em; */
        /* margin-left: auto; */
        width: 277px;
        left: auto;
        background: blue;
        flex-direction: column;
        height: 100vh;
        right: 0;
        top: 0;
        bottom: 0;

    }
    
    @media only screen and (min-width: 768px) and (max-width: 1023px){
        position: absolute;
        /* margin-right: 1em; */
        /* margin-left: auto; */
        width: 277px;
        left: auto;
        flex-direction: column;
        background: #fff;

        right: 0;
        top: 21vh;
        bottom: 0;

        border-radius: 0.5em;
    /* box-shadow: -4px 2px 45px rgba(0,0,0,0.4); */
        height: 75vh;
        padding: 1em;
    }
`;

const MenuItemContainer = styled.ul`
dipslay: flex;

//smaller screens and tablets
@media only screen and (min-width: 768px) and (max-width: 1024px){

    flex-direction: column;
    margin-bottom: auto;
    font-family: gotham-medium;
    font-size: 0.89rem;
    margin-top: 2em;
    width: 100%;
    margin-right: auto;

    /* margin-left: auto;
}
`   
const MenuItem = styled.li`
padding:1em 2.5em;
&:hover{
    background: #dedede4d;
    color:#000;
}
`;
const SubmenuItem = styled.li`
padding: 0 !important;
padding-top: auto;
padding-left: .8em;
`;
const CustomButton = styled.button`
display: flex;
padding: 0 !important;
padding: .3em 1.3em !important;
&>:nth-child(1){
    margin: auto;
}
&>:nth-child(2){
    margin: auto;
    margin-left: 1em;
    padding-top: .5em;
}
`

const HolderBox = styled.div`

`;
const DropdownPaper = styled.div`
    position: absolute;
    z-index: 8;
    top: 12%;
    width: auto;
    height: auto;
    background: #fff;
    border-radius: 0 0 .5em .5em;
    box-shadow: 1px 1px 30px rgba(0,0,0,.001)
`;

const MenuHamburger = styled.div`
display: none;
`;

export default function MenuComponent(){
    const {state,dispatch} = useStore()
    const [fontSize,setFontSize] = useState(1)    
    const [menuData,setMenuData]= useState(menus)
    const [anchorBusiness, setAnchorBusiness] = React.useState(null);
    const navigate = useNavigate(); // Add useNavigate hook
    const [divsToOpen,setDivsToOpen] = React.useState(
        Array(menuData.landingPage.filter(menuItem=>menuItem.type=='text' && menuItem.submenus).length).fill(false)
    );
    const isLogged = !!state.session.isLoggedIn;
    const user = state.session.user || null;
    const userPhoto = user?.photo || user?.photoUrl || user?.picture || null;

    let [showLoginDropdown, setShowLoginDropdown ] = useState(false)

    useEffect(()=>{
        const handleResize = () => {
            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            const newFontSize = Math.min(2, vw / 800);
            setFontSize(newFontSize);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    },[])

    function toggleDropdown(index){
        const newDivs = [...divsToOpen]
        newDivs[index] = !divsToOpen[index]
        setDivsToOpen(newDivs)
    }
    
    const handleLogout = () => {
        // clear token and update store
        try {
            localStorage.removeItem('authToken');
        } catch (e) {}
        dispatch({ type: 'LOGOUT' });
        // close any open modals
        dispatch({ type: 'SET_MODAL', payload: {
            login: { open: false }, signup: { open: false }, onBoarding: { open: false }, passwordRecover: { open: false }, createImovel: { open: false }, searchingOnMap: { open: false }
        }});
        toast.info('Sessão terminada');
        navigate('/');
    };
    const handleClose = (who) => {
        dispatch({
            type: 'TOGGLE_MODAL',
            payload: { modalName: null }, // Close all modals
        });
    };

    const handleOpen = (name)=>{
        if(isLogged && name =='login'){
            setShowLoginDropdown(value=>!value)
            return
        }
         // Update the URL based on the modal being opened
    const modalRoutes = {
        login: '/auth/login',
        signup: '/auth/signup',
        passwordRecover: '/auth/password-recover',
        onBoarding: '/auth/onboarding',
        createImovel: '/imovel/create',
    };
      const route = modalRoutes[name] || '/auth/onboarding';
      navigate(route); // Change the URL without navigating away from the current component
  
        dispatch({
            type: 'TOGGLE_MODAL',
            payload: { modalName: name }
        });
    }
    
    const navigateTo = (props)=>{
        // history.push(`/imovel/${props.url}`)
    }


    return (
    <NavContainer>
        <Box className='menu-box-logo'>
            <ResimovelLogo/>
            <Typography>Resimovel</Typography>
        </Box>
        <HolderBox className='menu-icon'>
            <MenuIcon/>
        </HolderBox>
        <ContainerBoxs>
            <HolderBox className='close-menu-icon opened'>
                <Close/>
            </HolderBox>
            <MenuItemContainer 
            style={{
                marginLeft: menuData.landingPage.filter(({type})=> type == 'text').length - 1 > 2?'auto !important':'20vw !important',
                '--resizeable-fontSize':fontSize
            }}
            className='menu-box-options'>
                { /* menu text dropdown */
                menuData?.landingPage?.filter(({type})=> type === 'text').map(
                    (menu,index)=>(
                    <div 
                    className='menu-item-text' 
                    key={index}
                    style={{
                        order: menu.order
                    }}
                    >
                        <Button
                            sx={{color: '#000',textTransform:'capitalize'}}
                            id={"basic-button-"+index}
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={()=>toggleDropdown(index)}
                        >
                            {menu.title} <span className='carret-icon'> <Carret/></span>
                        </Button>
                        <DropdownPaper
                            id={"dropdown-"+index+1}
                            className={`dropdown dropdown-${index+1}`}
                            anchorEl={anchorBusiness}
                            open={false}
                            onClose={handleClose}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                            style={{
                                display: divsToOpen[index]?'block': 'none'
                            }}
                        > 
                        <span className='placeholder-dropdown'
                        onClick={ ()=>{
                            if(menu.submenus.length>0)navigateTo({url:menu.title})
                        }}>{menu.title}</span>
                            {
                                menu.submenus.map((innerMenu,subindex)=>(
                                    <MenuItem 
                                    key={subindex} 
                                    className={innerMenu.submenus && `bold`}
                                    onClick={ ()=>{
                                        // if(innerMenu.submenus.length>0)navigateTo({url:innerMenu.submenus.title})
                                    }}>
                                        {innerMenu.title}
                                        {innerMenu?.submenus && 
                                        <div className={innerMenu.submenus && `dropdown-have-submenus dropdown-have-submenus-${subindex}`}>
                                            {innerMenu.submenus?.map( (innerSubmenu,innerSubIndex)=>(
                                                <SubmenuItem className='innerSubmenu-item' key={innerSubIndex}
                                                onClick={ ()=>{
                                                    // navigateTo({url:innerSubmenu.title})
                                                }}>
                                                    {innerSubmenu?.title}
                                                </SubmenuItem>
                                            ))}
                                        </div>}
                                        
                                    </MenuItem>
                                ))
                            }
                        </DropdownPaper>
                    </div>
                    )
                )
            }
            </MenuItemContainer>
            <Box 
                className='menu-box-buttons'
                sx={{
                    display: 'flex'
                }}>
                {/** buttons menu*/
                    menuData?.landingPage?.filter(({type})=> type === 'button').map((menu,index)=>
                    (<>
                        <CustomButton 
                        style={{
                            order: menu.order,
                            backgroundColor: menu.bgColor,
                            fontFamily: 'gotham-medium'
                        }}
                        key={index} 
                        onClick={()=>handleOpen(menu.name)}
                        className={menu.class}
                        id={menu.allowAvatar && isLogged?'avatar-dropdown':'avatar-login-dropdown'}>
                            {menu.allowAvatar && isLogged && (userPhoto ? (
                                <img src={userPhoto} alt={user.name || 'avatar'} style={{width:24,height:24,borderRadius:'50%'}}/>
                            ) : (
                                <Avatar/>
                            ))}
                            <span>{menu.allowAvatar && isLogged ? (user?.name || menu.title) : menu.title}</span>
                        </CustomButton>
                        {isLogged && (
                            <DropdownPaper
                            id={`dropdown-login-main-${index}`}
                            className={`dropdown-login-main`}
                            open={false}
                            onClose={e=>handleClose(e,index)}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                            style={{
                                display: showLoginDropdown?'block': 'none'
                            }}
                        > 
                            {

                                menu.submenus?.map((submenu,subindex)=>(
                                    <MenuItem key={subindex} onClick={e=>{
                                        if(submenu.action && submenu.action === 'logout'){
                                            handleLogout();
                                            return;
                                        }
                                        handleClose(e,subindex)
                                    }}>
                                        {submenu.title}
                                    </MenuItem>
                                ))
                            }
                        </DropdownPaper>
                        )}
                    </>)
                )
                }
            </Box>
        </ContainerBoxs>
        
        <FullScreenDialog 
        open={state.modal.login.open || state.modal.signup.open || state.modal.onBoarding.open || state.modal.passwordRecover.open}
        description={(<>Escolha um de nossos <span className='highlight-yellow'>Planos profissional</span> </>)}
        miniDescription={`Descubra a excelência em serviços com nossa seleção de Planos Profissionais
        cuidadosamente elaborados para atender às suas necessidades.
        `}
        >
            {state.modal.onBoarding.open && <OnBoardingForm /> }
            {state.modal.signup.open && <SignupForm /> } 
            {state.modal.login.open &&  <LoginForm />}
            {state.modal.passwordRecover.open &&  <PasswordRecoverForm />}
 
        </FullScreenDialog> 
        <FullScreenDialog
         open={state.modal.createImovel.open}
         disableLeftContent={true}
         overlap={true}
         dispatch={dispatch}
        >
            <CreateImovelForm/>
        </FullScreenDialog>
        

    </NavContainer>
    )
}