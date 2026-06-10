import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`

export const SkeletonBase = styled.div`
  background: #eee;
  /* 그라데이션을 넓게 설정하고 배경 크기를 200%로 설정 */
  background-image: linear-gradient(90deg, #eee 0%, #c5c4c4f6 50%, #eee 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 2px;
`
