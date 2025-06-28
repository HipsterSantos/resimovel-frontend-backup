import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import styled from 'styled-components';
import bannerLeft from '@svg/banner-background-left.svg'
import bannerRight from '@svg/banner-background-right.svg'
import ResimovelLogo from '@svg/resimove.logo';
import './style.scss'
import { Typography } from '@mui/material';
import { useStore } from '../../contexts/states.store.context';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Header = styled.div``;
const DialogBody = styled.div`
font-family:gotham-light !important;
display:flex;

`;
const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
  padding: ${(props)=>props.pd+'em' ||'1em'};
  background-color: ${props=>!props?.disableLeftContent&&'#F2F3FC'};
  background: ${(props)=> props?.disableLeftContent?'':`url(${bannerLeft})no-repeat,url(${bannerRight})no-repeat`};
  background-position: -17vw 50vh, 60vw 1vh;
`;

const CloseContainer = styled.div`
    align-self: flex-end;
    margin: 1em;
    margin-left: auto;
`;

const HeaderContainer = styled.div`
  display:flex;
  position: ${(props)=>props.overlap && 'absolute'};
  right: ${(props)=>props.overlap && props.r0 && 0};
  
  //auto
  margin-right: ${(props)=>props.mra && 'auto'};
  margin-left: ${(props)=>props.mla && 'auto'};
  
  //set-value
  margin-right: ${(props)=>props.mr && props.mr };
  margin-left: ${(props)=>props.ml && props.ml};
`;

const Footer = styled.div``;

export default function FullScreenDialog(props) {
  const [open, setOpen] = React.useState();
  const {states,dispatch} = useStore()
  
  console.log('create-imovel--',states)
  console.log('open--',open)

  const handleClose = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { modalName: null }, // Close all modals
    });
  };

  const renderChildrenWithProps = () =>
    React.Children.map(props.children, (child) =>
        React.isValidElement(child)
            ? React.cloneElement(child, { ...props }) // Pass all props to children
            : child
    );
  return (
    <React.Fragment>

      <Dialog
        fullScreen
        open={props.open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogContainer 
        className='modal-contianer'
        pd={0}
        disableLeftContent={props.disableLeftContent}
        >
          <HeaderContainer r0 overlap={props.overlap}>
              {props.head && 
                  <Header>
                      {props.head}
                  </Header>
              }
            <CloseContainer>
                <CloseIcon onClick={()=>handleClose()}/>
            </CloseContainer>
          </HeaderContainer>
            <DialogBody>
              {!props.disableLeftContent &&               
                <div className="logo-and-content">
                  <span>
                  <ResimovelLogo/>Resimovel
                  </span>
                  <div className="content">
                    <Typography variant='h4'>
                      {props.description}
                    </Typography>
                    <Typography variant='h5'>
                      {props.miniDescription}
                    </Typography>
                  </div>
                </div>
              }
              <div className="card-content-section">
                {/* {props?.children} */}
                {renderChildrenWithProps()}
              </div>
            </DialogBody>
            {
                props.footer && 
                <Footer>
                    {props.footer}
                </Footer>
            }
        </DialogContainer>
      </Dialog>
    </React.Fragment>
  );
}