import styled from '@emotion/styled';

export const AdSliderViewport = styled.div`
  width: 100%;
  height: 100%;

  & .ad-media-swiper {
    width: 100%;
    height: 100%;
  }

  & .swiper-slide {
    height: 100%;
  }
`;

export const AdMediaImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AdMediaVideo = styled.video`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
