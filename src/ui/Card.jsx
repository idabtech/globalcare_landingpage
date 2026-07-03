import React from 'react';
import { C } from '../constants/data';

const Card = ({ children, style = {}, ...props }) => <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, ...style }} {...props}>{children}</div>;

export default Card;
