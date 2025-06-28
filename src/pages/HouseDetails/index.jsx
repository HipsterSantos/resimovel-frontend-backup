import React, { useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Styled Components (same as before)
const Container = styled.div`
  padding: 2em;
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
`;

const Price = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1em;
`;

const GalleryContainer = styled.div`
  position: relative;
  margin-bottom: 2em;
`;

const MainGallery = styled(Slider)`
  .slick-prev,
  .slick-next {
    z-index: 1;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    &:before {
      font-size: 20px;
      color: white;
    }
  }
  .slick-prev {
    left: 10px;
  }
  .slick-next {
    right: 10px;
  }
`;

const ThumbnailStrip = styled.div`
  display: flex;
  overflow-x: auto;
  margin-top: 1em;
  gap: 0.5em;
  padding-bottom: 0.5em;
`;

const Thumbnail = styled.div`
  cursor: pointer;
  border: 2px solid ${(props) => (props.active ? '#d9f070' : 'transparent')};
  border-radius: 4px;
  overflow: hidden;
  flex: 0 0 auto;
  width: 80px;
  height: 60px;
  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MediaItem = styled.div`
  img,
  video {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 0.5em;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5em;
`;

const FeaturesList = styled.ul`
  list-style-type: disc;
  margin-left: 1.5em;
  margin-bottom: 1.5em;
`;

const FeatureItem = styled.li`
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5em;
`;

const Location = styled.div`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5em;
`;

const ContactButton = styled.button`
  background-color: #d9f070;
  border: none;
  padding: 1em 2em;
  font-size: 1rem;
  border-radius: 0.5em;
  cursor: pointer;
  margin-bottom: 1.5em;

  &:hover {
    background-color: #c0d860;
  }
`;

const PublishedBy = styled.div`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1.5em;
`;

const MoreInfo = styled.a`
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

// Gallery Settings for react-slick
const gallerySettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

const HouseDetails = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Sample media (20 images from Unsplash and 5 videos from open-source platforms)
  const media = [
    // Images from Unsplash
    { type: 'image', url: 'https://source.unsplash.com/800x400/?house,interior' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?living-room' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?kitchen' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?bedroom' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?bathroom' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?garden' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?pool' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?balcony' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?dining-room' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?home-office' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?stairs' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?fireplace' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?garage' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?patio' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?laundry-room' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?basement' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?attic' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?roof' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?front-yard' },
    { type: 'image', url: 'https://source.unsplash.com/800x400/?backyard' },

    // Videos from open-source platforms
    { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4' },
    { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4' },
    { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  ];

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <Container>
      <Price>Preço 58.010.000Kz</Price>

      {/* Gallery Section */}
      <GalleryContainer>
        <MainGallery {...gallerySettings} initialSlide={activeIndex} afterChange={setActiveIndex}>
          {media.map((item, index) => (
            <MediaItem key={index}>
              {item.type === 'image' ? (
                <img src={item.url} alt={`House ${index + 1}`} />
              ) : (
                <video controls>
                  <source src={item.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </MediaItem>
          ))}
        </MainGallery>

        {/* Thumbnail Strip */}
        <ThumbnailStrip>
          {media.map((item, index) => (
            <Thumbnail
              key={index}
              active={index === activeIndex}
              onClick={() => handleThumbnailClick(index)}
            >
              {item.type === 'image' ? (
                <img src={item.url} alt={`Thumbnail ${index + 1}`} />
              ) : (
                <video>
                  <source src={item.url} type="video/mp4" />
                </video>
              )}
            </Thumbnail>
          ))}
        </ThumbnailStrip>
      </GalleryContainer>

      {/* House Details */}
      <SectionTitle>Sobre o imóvel</SectionTitle>
      <Description>
        Com longa opção de frio e amendo com poços próprios e frios removidos de cabelo com sua preferência precisa.
      </Description>

      <SectionTitle>Características do imóvel</SectionTitle>
      <Description>Vivenda conta com as seguintes características:</Description>
      <FeaturesList>
        <FeatureItem>Salão com autos bem várias</FeatureItem>
        <FeatureItem>3 anos saídas</FeatureItem>
        <FeatureItem>2 cozinhas ocupadas i rás do chão</FeatureItem>
        <FeatureItem>2 bocejarias</FeatureItem>
        <FeatureItem>7 hoje de apoio</FeatureItem>
        <FeatureItem>2 Escolas adesso a parte de cima</FeatureItem>
        <FeatureItem>3 períodos para visituras</FeatureItem>
        <FeatureItem>Liquíndios</FeatureItem>
        <FeatureItem>Quinta para 10 visituras</FeatureItem>
        <FeatureItem>Cessá dos jornais</FeatureItem>
        <FeatureItem>Cessá dos segurança</FeatureItem>
        <FeatureItem>1 fábricas</FeatureItem>
        <FeatureItem>11 horas de água</FeatureItem>
        <FeatureItem>Esposa preparado para fazer</FeatureItem>
        <FeatureItem>Jardim</FeatureItem>
        <FeatureItem>Cabitras e Piscina</FeatureItem>
      </FeaturesList>

      <SectionTitle>Localização</SectionTitle>
      <Location>Análise Géia Leaming e São Senão</Location>

      <ContactButton>Contactar para alugar este imóvel</ContactButton>

      <PublishedBy>Publicado por Imovirtual</PublishedBy>
      <MoreInfo href="https://www.imovirtual.com" target="_blank" rel="noopener noreferrer">
        Sabia mais sobre a Imovirtual!
      </MoreInfo>
    </Container>
  );
};

export default HouseDetails;