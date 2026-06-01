import styled from '@emotion/styled';

export const Wrapper = styled.div`
  padding-bottom: 30px;
`;

export const ImgContainer = styled.div`
  width: 46.875rem;
  height: 8.4375rem;
  flex-shrink: 0;
  aspect-ratio: 50/9;
  border-radius: 0.5rem;
  overflow: hidden;

  & .top-banner-ad-swiper {
    width: 100%;
    height: 100%;
  }
`;

export const SlideImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
`;
