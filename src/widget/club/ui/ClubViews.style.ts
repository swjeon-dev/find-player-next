import { SkeletonBase } from '@/shared'
import styled, { css } from 'styled-components'

const ErrorBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  justify-content: center;
  align-items: center;

  height: 140px;
  padding: 10px;
  border-radius: 12px;

  background-color: #ffdddd;
  color: #b00020;

  font-size: 0.85rem;
`

const RetryButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  background: #b00020;
  color: white;
`

const ClubSkeleton = styled(SkeletonBase)`
  min-width: 70px;
  aspect-ratio: 1/1;
  border-radius: 25%;
  margin: auto;
`

/** 태블릿에서만 렌더: 팀 그리드 패널 열기/닫기 */
const TabletToggleButton = styled.button`
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 101;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  background: #023047;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
`

interface IClubContainer {
  $isLoading: boolean
}

const ClubContainer = styled.div<IClubContainer>`
  grid-template-columns: repeat(3, 1fr);

  ${props =>
    props.$isLoading
      ? css`
          cursor: wait;
        `
      : css`
          cursor: auto;
        `}

  display: grid;
  background-color: #8ecae6;

  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  max-width: 250px;

  min-height: 80px;
  height: fit-content;
  border-radius: 15px;

  z-index: 31;

  ${props => props.theme.media.tablet} {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    height: fit-content;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 100;
  }
`

export {
  ErrorBox,
  RetryButton,
  ClubSkeleton,
  TabletToggleButton,
  ClubContainer,
}
