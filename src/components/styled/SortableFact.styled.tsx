import styled from "@emotion/styled";
import { CSS } from "@dnd-kit/utilities";
export const FactContainer$div = styled.div<{ transition; transform }>`
  ${({ transform, transition }) => `
  transform: ${CSS.Transform.toString(transform)};
  transition: ${transition};
  `}
`;
