import styled, { css } from 'styled-components'

export const Container = styled.div<{ $isActive: boolean }>`
  min-width: 70px;
  aspect-ratio: 1/1;
  position: relative;
  text-align: center;
  padding: 5px;
  transition: transform 0.3s ease-in-out;

  ${props =>
    props.$isActive
      ? css`
          cursor: pointer;
          &:hover {
            transform: scale(1.05);
            z-index: 5;
          }
        `
      : css`
          cursor: auto;
        `}
`

export const Emblem = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  display: block; /* 하단 여백 제거 */
`

