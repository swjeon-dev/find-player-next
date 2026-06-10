import styled from 'styled-components'

import { SkeletonBase } from '@/shared'

const FormContainer = styled.div<{
  $isPending: boolean
  $isChanging?: boolean
}>`
  position: relative;
  width: 100%;
  height: 280px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin: 0 auto 30px;
  background-color: white;
  border-radius: 15px;
  padding-bottom: 15px;

  opacity: ${props => {
    if (props.$isPending) return '0.8'
    if (props.$isChanging) return '0.92'
    return '1'
  }};
  transition: opacity 0.2s ease;
  z-index: 10;

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
    border-radius: 0;
  }
`

const PhotoSkeleton = styled(SkeletonBase)`
  width: 160px;
  height: 180px;
  border-radius: 35px;
  margin-bottom: 20px;
`

const Photo = styled.img<{
  $isCorrect: boolean
  $isChanging?: boolean
}>`
  width: 160px;
  height: 180px;
  border-radius: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  ${props => (props.$isCorrect ? null : 'filter: blur(13px)')};

  animation: ${props =>
    props.$isChanging
      ? 'quiz-fetching 0.9s ease-in-out infinite'
      : 'showing-image 0.3s ease-out forwards'};

  @keyframes showing-image {
    0% {
      opacity: 0;
      transform: translateX(20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes quiz-fetching {
    0%,
    100% {
      opacity: 0.88;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(0.985);
    }
  }
`

export { FormContainer, PhotoSkeleton, Photo }
