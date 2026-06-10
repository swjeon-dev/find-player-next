import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Page = styled.section`
  width: 100%;
  min-height: calc(100vh - 300px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0 56px;
`

export const Card = styled.div`
  width: min(100%, 720px);
  border-radius: 20px;
  padding: 36px 28px;
  background-color: #023047;
  border: 1px solid rgba(255, 255, 255, 0.12);

  ${({ theme }) => theme.media.mobile} {
    padding: 28px 20px;
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
`

export const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
  font-weight: 800;
`

export const Description = styled.p`
  margin: 0;
  max-width: 520px;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.6;
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 4px;
`

export const ActionLink = styled(Link)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 170px;
  padding: 14px 18px;
  border-radius: 14px;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    background-color 0.2s ease;
  color: ${({ $variant }) => ($variant === 'secondary' ? 'white' : '#001d3d')};
  background-color: ${({ $variant }) =>
    $variant === 'secondary' ? 'rgba(255, 255, 255, 0.12)' : '#f9c74f'};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'secondary' ? 'rgba(255, 255, 255, 0.18)' : 'transparent'};

  &:hover {
    transform: translateY(-2px);
    opacity: 0.96;
  }

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`
