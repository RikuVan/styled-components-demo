import * as React from 'react'

import is, { match } from 'styled-is'
import styled, { ThemeProvider, createGlobalStyle, css, keyframes } from 'styled-components'

import { darken } from 'polished'

type Mode = 'default' | 'dark'

/* THEME TYPES */
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      purple: 'purple'
    }
  }
}

/* GLOBALS with THEME from CONTEXT */
const GlobalStyle = createGlobalStyle<{ mode: Mode }>`
  body {
    color: ${({ theme }) => (theme.colors.purple ? 'purple' : 'black')};
    background: ${({ mode }) => (mode === 'dark' ? 'yellow' : 'white')};
  }
`

/* HELPERS */
const phone = (inner: string) => css`
  @media (min-width: 600px) {
    ${inner};
  }
`

/* BASIC */
const Title = styled.h1`
  text-transform: uppercase;
  font-size: 2rem;
  ${phone(`
    font-size: 1.5rem;
  `)}
`

/* EXTENDING*/
// TIP: styled((extra, ...rest) => <Title {...rest} />)
const BiggerTitle = styled(({ size, ...props }) => <Title {...props} />)`
  font-size: 4rem;
  ${phone(`
    font-size: 2.5rem;
  `)}
`

/* KEYFRAMES */
const pulse = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`
/* CSS HELPER */
const animation = (props: { animationLength: string }) =>
  css`
    ${pulse} ${props.animationLength} infinite alternate;
  `

type PulseButtonProps = {
  centered?: boolean
  animationLength: string
  submit?: boolean
}

const buttonType = ({ submit }: PulseButtonProps) => ({
  type: submit ? 'submit' : 'button',
})

/* CLASSES, AMPERSANDS AND DYNAMIC STYLES */
const PulseButton = styled.button.attrs(buttonType)<PulseButtonProps>`
  animation: ${animation};

  &:hover {
    animation: none;
    border-color: ${darken(0.3, 'purple')};
  }

  &.primary-btn {
    padding: 10px;
    font-size: 1rem;

    &--purply {
      border: 2px solid ${({ theme }) => theme.colors.purple};
    }
  }

  ${is('centered')`
    margin: auto;
  `};

  ${match('mode', 'dark')`
    background: yellow;
  `};
`

export default function App() {
  const [mode, setMode] = React.useState<Mode>('default')
  const toggleMode = React.useCallback(
    () => setMode((m) => (m === 'default' ? 'dark' : 'default')),
    [setMode]
  )

  return (
    <ThemeProvider
      theme={
        {
          colors: {
            purple: 'purple',
          },
        } as const
      }
    >
      <GlobalStyle mode={mode} />
      <BiggerTitle>Styled components</BiggerTitle>
      <PulseButton
        onClick={toggleMode}
        className="primary-btn primary-btn--purply"
        animationLength="2s"
        centered
      >
        toggle theme
      </PulseButton>
    </ThemeProvider>
  )
}
