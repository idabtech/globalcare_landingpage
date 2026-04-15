import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [page, setPage] = useState('home');
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [compareList, setCompareList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');
    const [notification, setNotification] = useState(null);
    const [patientTab, setPatientTab] = useState('overview');
    const [patientApptsView, setPatientApptsView] = useState('list');
    const [patientTravelView, setPatientTravelView] = useState('flights');
    const [patientPaymentsView, setPatientPaymentsView] = useState('history');
    const [lang, setLang] = useState('en');
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [heroVisible, setHeroVisible] = useState(false);
    const [hospitalTab, setHospitalTab] = useState('info');
    const [hoveredNav, setHoveredNav] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [schedView, setSchedView] = useState('calendar');
    const [schedStep, setSchedStep] = useState(1);
    const [selDoc, setSelDoc] = useState(null);
    const [selPlat, setSelPlat] = useState(null);
    const [selDate, setSelDate] = useState(null);
    const [selTime, setSelTime] = useState(null);
    const [calYear, setCalYear] = useState(new Date().getFullYear());
    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [calView, setCalView] = useState('month');
    const [calSelDate, setCalSelDate] = useState(null);

    useEffect(() => {
        setHeroVisible(true);
    }, []);

    const showNotif = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const toggleCompare = (hospital) => {
        setCompareList(prev => {
            const exists = prev.find(h => h.id === hospital.id);
            if (exists) return prev.filter(h => h.id !== hospital.id);
            if (prev.length >= 3) return prev;
            return [...prev, hospital];
        });
    };

    const value = {
        page, setPage,
        selectedHospital, setSelectedHospital,
        compareList, setCompareList,
        searchQuery, setSearchQuery,
        selectedSpecialty, setSelectedSpecialty,
        notification, setNotification,
        patientTab, setPatientTab,
        patientApptsView, setPatientApptsView,
        patientTravelView, setPatientTravelView,
        patientPaymentsView, setPatientPaymentsView,
        lang, setLang,
        chatOpen, setChatOpen,
        chatMessages, setChatMessages,
        chatInput, setChatInput,
        heroVisible, setHeroVisible,
        hospitalTab, setHospitalTab,
        hoveredNav, setHoveredNav,
        sessions, setSessions,
        schedView, setSchedView,
        schedStep, setSchedStep,
        selDoc, setSelDoc,
        selPlat, setSelPlat,
        selDate, setSelDate,
        selTime, setSelTime,
        calYear, setCalYear,
        calMonth, setCalMonth,
        calView, setCalView,
        calSelDate, setCalSelDate,
        showNotif,
        toggleCompare
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
