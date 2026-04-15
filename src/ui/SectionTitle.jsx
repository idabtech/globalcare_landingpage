import React from 'react';
import { C } from '../constants/data';

const SectionTitle = ({ title, sub }) => (
    <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{title}</h2>
        <div style={{ height: 4, width: 40, background: C.teal, borderRadius: 2, marginBottom: 12 }} />
        <p style={{ color: C.slateL, fontSize: 16 }}>{sub}</p>
    </div>
);

export default SectionTitle;
