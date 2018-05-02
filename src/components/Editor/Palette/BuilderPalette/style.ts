import styled from "styled-components";
import Paper from "material-ui/Paper";

export const HideableDiv = styled.div`
  &.hidden {
    display: none
  }
`

export const ScrollablePaper = styled(Paper as any)`
  && {
    max-height: 576px;
    overflow: auto;
  }
`