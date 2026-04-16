import React from 'react';
import { C } from '../constants/data';

const Badge = ({ children, color = C.teal }) => <span style={{ background: `${color}22`, color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{children}</span>;

export default Badge;
